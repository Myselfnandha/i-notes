import React, { useState } from 'react';
import { QrCode, Copy, X, Wifi } from 'lucide-react';
import { SyncState } from '../types';

interface SyncBannerProps {
  room: string;
  syncUrl: string;
  syncState: SyncState;
  latencyMs: number | null;
  connectedCount: number;
  onOpenSyncModal: () => void;
  onCopySyncLink: () => void;
}

export const SyncBanner: React.FC<SyncBannerProps> = ({
  room,
  syncState,
  latencyMs,
  connectedCount,
  onOpenSyncModal,
  onCopySyncLink
}) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('novasync_banner_dismissed') === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('novasync_banner_dismissed', 'true');
  };

  const handleRestore = () => {
    setIsDismissed(false);
    localStorage.setItem('novasync_banner_dismissed', 'false');
  };

  if (isDismissed) {
    return (
      <div className="sync-banner-collapsed" onClick={handleRestore} title="Show cloud sync details">
        <span className="banner-pulse-dot" />
        <span className="collapsed-text">
          Room <strong>{room}</strong> • {connectedCount} {connectedCount === 1 ? 'device' : 'devices'} synced
        </span>
        <span className="collapsed-link">Show Banner ↓</span>
      </div>
    );
  }

  return (
    <section className="sync-banner">
      <div className="banner-content">
        <div className="banner-info">
          <div className="banner-badge-group">
            <span className="banner-pill">
              <Wifi size={13} style={{ marginRight: 4 }} />
              24/7 Cloud
            </span>
            <span className="banner-room-chip">
              Room: <strong>{room}</strong>
            </span>
          </div>
          <span className="banner-text">
            Instant real-time sync across your phones, tablets & laptops{latencyMs !== null ? ` (${latencyMs}ms)` : ''}.
          </span>
        </div>

        <div className="banner-actions">
          <button className="banner-btn" onClick={onOpenSyncModal} title="Pair mobile phone via QR code">
            <QrCode size={14} />
            <span>Pair</span>
          </button>
          <button className="banner-btn secondary" onClick={onCopySyncLink} title="Copy device sync link">
            <Copy size={14} />
            <span>Copy Link</span>
          </button>
          <button
            className="banner-close-btn"
            onClick={handleDismiss}
            title="Minimize banner"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
