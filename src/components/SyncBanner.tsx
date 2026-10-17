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
      <div
        className="cloud-strip"
        style={{ cursor: 'pointer', opacity: 0.8 }}
        onClick={handleRestore}
        title="Click to show room sync actions"
      >
        <div className="cloud-strip-left">
          <span className="room-chip">Room: {room}</span>
          <span>• 24/7 Cloud Synced ({connectedCount} devices)</span>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Show ↓</span>
      </div>
    );
  }

  return (
    <div className="cloud-strip">
      <div className="cloud-strip-left">
        <span className="room-chip">Room: {room}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Wifi size={13} style={{ color: 'var(--accent-emerald)' }} />
          24/7 Cloud Synced {latencyMs !== null ? `(${latencyMs}ms)` : ''}
        </span>
      </div>

      <div className="cloud-strip-actions">
        <button className="strip-btn" onClick={onOpenSyncModal} title="Pair mobile phone with QR code">
          <QrCode size={13} />
          <span>Pair</span>
        </button>
        <button className="strip-btn" onClick={onCopySyncLink} title="Copy sync link">
          <Copy size={13} />
          <span>Copy</span>
        </button>
        <button className="strip-btn close" onClick={handleDismiss} title="Dismiss strip" aria-label="Dismiss">
          <X size={13} />
        </button>
      </div>
    </div>
  );
};
