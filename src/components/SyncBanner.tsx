import React, { useState } from 'react';
import { QrCode, Copy, Cloud, Check, ChevronDown, ChevronUp, X } from 'lucide-react';
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
  syncUrl,
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
      <div className="sync-banner-collapsed" onClick={handleRestore} title="Click to show cloud sync details">
        <span className="banner-pulse-dot"></span>
        <span className="collapsed-text">
          Room <strong>{room}</strong> • 24/7 Cloud Synced ({connectedCount} {connectedCount === 1 ? 'device' : 'devices'})
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
            <span className="banner-pill">⚡ 24/7 Cloud Sync</span>
            <span className="banner-room-chip">
              Room: <strong>{room}</strong>
            </span>
          </div>
          <div className="banner-text">
            <span className="banner-desktop-text">
              Running 24/7 autonomously on Hugging Face cloud{' '}
              {latencyMs !== null ? `(${latencyMs}ms latency)` : ''}. Instant real-time sync across all your phones, tablets & laptops worldwide.
            </span>
            <span className="banner-mobile-text">
              Real-time sync active worldwide {latencyMs !== null ? `(${latencyMs}ms)` : ''}.
            </span>
          </div>
        </div>

        <div className="banner-actions">
          <button className="banner-btn" onClick={onOpenSyncModal} title="Pair mobile phone via QR code">
            <QrCode size={15} />
            <span>Pair Phone</span>
          </button>
          <button className="banner-btn secondary" onClick={onCopySyncLink} title="Copy device sync link">
            <Copy size={15} />
            <span>Copy Link</span>
          </button>
          <button
            className="banner-close-btn"
            onClick={handleDismiss}
            title="Minimize banner to save screen space"
            aria-label="Minimize banner"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};
