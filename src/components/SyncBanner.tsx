import React from 'react';
import { QrCode, Copy } from 'lucide-react';

interface SyncBannerProps {
  room: string;
  syncUrl: string;
  onOpenSyncModal: () => void;
  onCopySyncLink: () => void;
}

export const SyncBanner: React.FC<SyncBannerProps> = ({
  room,
  onOpenSyncModal,
  onCopySyncLink
}) => {
  return (
    <section className="sync-banner">
      <div className="banner-content">
        <div className="banner-info">
          <span className="banner-pill">⚡ Instant Cross-Device Sync</span>
          <span className="banner-text">
            Room: <strong>{room}</strong> • Real-time across all your phones, tablets & laptops worldwide.
          </span>
        </div>
        <div className="banner-actions">
          <button className="banner-btn" onClick={onOpenSyncModal}>
            <QrCode size={16} />
            <span>Scan QR Code to Pair Phone</span>
          </button>
          <button className="banner-btn secondary" onClick={onCopySyncLink}>
            <Copy size={16} />
            <span>Copy Device Link</span>
          </button>
        </div>
      </div>
    </section>
  );
};
