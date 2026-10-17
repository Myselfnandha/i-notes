import React from 'react';
import { Search, Plus, Link, Bell, Sun, Moon, Download, HardDriveDownload, Volume2 } from 'lucide-react';
import { SyncState } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSyncModal: () => void;
  onOpenCreateModal: () => void;
  onQuickPaste: () => void;
  onRequestNotifications: () => void;
  onTestSound: () => void;
  onOpenBackupModal: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  syncState: SyncState;
  connectedCount: number;
  latencyMs: number | null;
  pendingOfflineCount: number;
  installPromptAvailable: boolean;
  onTriggerInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenSyncModal,
  onOpenCreateModal,
  onQuickPaste,
  onRequestNotifications,
  onTestSound,
  onOpenBackupModal,
  onToggleTheme,
  theme,
  syncState,
  connectedCount,
  latencyMs,
  pendingOfflineCount,
  installPromptAvailable,
  onTriggerInstall
}) => {
  const getSyncBadge = () => {
    switch (syncState) {
      case 'connected':
        return (
          <>
            <span className="sync-dot live"></span>
            <span className="sync-text">
              Synced ({connectedCount} {connectedCount === 1 ? 'device' : 'devices'}
              {latencyMs !== null ? ` • ${latencyMs}ms` : ''})
            </span>
          </>
        );
      case 'connecting':
        return (
          <>
            <span className="sync-dot connecting"></span>
            <span className="sync-text">Connecting...</span>
          </>
        );
      case 'reconnecting':
        return (
          <>
            <span className="sync-dot reconnecting"></span>
            <span className="sync-text">Reconnecting...</span>
          </>
        );
      case 'offline':
      default:
        return (
          <>
            <span className="sync-dot offline"></span>
            <span className="sync-text">
              Offline {pendingOfflineCount > 0 ? `(${pendingOfflineCount} queued)` : '• Pair'}
            </span>
          </>
        );
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Group */}
        <div className="brand-group" onClick={onOpenSyncModal} title="Pair device, check cloud tunnel, or switch sync rooms">
          <div className="brand-logo">
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#041014' }}>⚡</span>
            <span className="pulse-indicator"></span>
          </div>
          <div className="brand-text">
            <h1 className="brand-name">Nova<span>Sync</span></h1>
            <span className="brand-badge">24/7 ULTRA SYNC</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            id="searchInput"
            placeholder="Search notes, reminders, reels, tags... (Ctrl+K or ⌘K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
            aria-label="Search items"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => onSearchChange('')} title="Clear search">
              ✕
            </button>
          )}
          <kbd className="kbd-shortcut">⌘K</kbd>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Live Sync Status Pill */}
          <button
            className={`pill-btn sync-btn sync-state-${syncState}`}
            onClick={onOpenSyncModal}
            title={
              syncState === 'connected'
                ? `Realtime sync active across ${connectedCount} devices. Click for QR code & mobile sync link.`
                : 'Click to pair your phone or configure backend cloud tunnel.'
            }
          >
            {getSyncBadge()}
          </button>

          {/* Install Mobile PWA Button */}
          {installPromptAvailable && (
            <button className="pill-btn primary install-pill" onClick={onTriggerInstall} title="Install NovaSync as Native Mobile App">
              <Download size={15} />
              <span className="btn-label">Install App</span>
            </button>
          )}

          {/* Quick Paste Clipboard Link */}
          <button className="action-btn icon-btn" onClick={onQuickPaste} title="Auto-detect & save link from clipboard">
            <Link size={16} />
            <span className="btn-label">Paste Link</span>
          </button>

          {/* New Item Button */}
          <button className="action-btn primary-btn" onClick={onOpenCreateModal} title="Create Note, Reminder, or Link (N)">
            <Plus size={18} />
            <span>New Item</span>
          </button>

          {/* Sound Preview Chime */}
          <button className="icon-toggle-btn" onClick={onTestSound} title="Test Harmonic Alert Chime">
            <Volume2 size={17} />
          </button>

          {/* Backup & Export */}
          <button className="icon-toggle-btn" onClick={onOpenBackupModal} title="Backup, Export & Restore notes">
            <HardDriveDownload size={17} />
          </button>

          {/* Notification Alert Bell */}
          <button className="icon-toggle-btn" onClick={onRequestNotifications} title="Enable browser alerts & sound">
            <Bell size={17} />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button className="icon-toggle-btn" onClick={onToggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
};
