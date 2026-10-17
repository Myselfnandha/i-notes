import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Link, Bell, Sun, Moon, Download, HardDriveDownload, Volume2, ArrowLeft, X } from 'lucide-react';
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const getSyncBadge = (isCompact = false) => {
    switch (syncState) {
      case 'connected':
        return (
          <>
            <span className="sync-dot live"></span>
            <span className="sync-text">
              {isCompact
                ? `${connectedCount}d`
                : `Synced (${connectedCount} ${connectedCount === 1 ? 'device' : 'devices'}${latencyMs !== null ? ` • ${latencyMs}ms` : ''})`}
            </span>
          </>
        );
      case 'connecting':
        return (
          <>
            <span className="sync-dot connecting"></span>
            <span className="sync-text">{isCompact ? '...' : 'Connecting...'}</span>
          </>
        );
      case 'reconnecting':
        return (
          <>
            <span className="sync-dot reconnecting"></span>
            <span className="sync-text">{isCompact ? '...' : 'Reconnecting...'}</span>
          </>
        );
      case 'offline':
      default:
        return (
          <>
            <span className="sync-dot offline"></span>
            <span className="sync-text">
              {isCompact ? 'Offline' : `Offline ${pendingOfflineCount > 0 ? `(${pendingOfflineCount})` : '• Pair'}`}
            </span>
          </>
        );
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Mobile Full-Width Search Mode */}
        {isMobileSearchOpen ? (
          <div className="mobile-search-active-bar">
            <button
              className="icon-toggle-btn mobile-search-back-btn"
              onClick={() => {
                setIsMobileSearchOpen(false);
                onSearchChange('');
              }}
              title="Close search"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="search-wrapper mobile-search-expanded">
              <Search className="search-icon" size={17} />
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search notes, reminders, tags..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
                aria-label="Search items"
              />
              {searchQuery && (
                <button
                  className="clear-btn"
                  onClick={() => onSearchChange('')}
                  title="Clear search"
                  aria-label="Clear"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Brand Group */}
            <div className="brand-group" onClick={onOpenSyncModal} title="Pair device, check cloud sync, or switch rooms">
              <div className="brand-logo">
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#041014' }}>⚡</span>
                <span className="pulse-indicator"></span>
              </div>
              <div className="brand-text">
                <h1 className="brand-name">
                  Nova<span>Sync</span>
                </h1>
                <span className="brand-badge">24/7 ULTRA SYNC</span>
              </div>
            </div>

            {/* Desktop Global Search Bar (hidden on mobile) */}
            <div className="search-wrapper desktop-search-bar">
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
              {/* Mobile Search Trigger Icon */}
              <button
                className="icon-toggle-btn mobile-search-trigger"
                onClick={() => setIsMobileSearchOpen(true)}
                title="Search notes and tags"
                aria-label="Open search"
              >
                <Search size={18} />
              </button>

              {/* Live Sync Status Pill (Adapts desktop & mobile) */}
              <button
                className={`pill-btn sync-btn sync-state-${syncState}`}
                onClick={onOpenSyncModal}
                title={
                  syncState === 'connected'
                    ? `Realtime sync active across ${connectedCount} devices. Click for QR code & device link.`
                    : 'Click to pair your phone or check cloud sync status.'
                }
              >
                <span className="desktop-badge-text">{getSyncBadge(false)}</span>
                <span className="mobile-badge-text">{getSyncBadge(true)}</span>
              </button>

              {/* Install Mobile PWA Button */}
              {installPromptAvailable && (
                <button
                  className="pill-btn primary install-pill"
                  onClick={onTriggerInstall}
                  title="Install NovaSync as Native Mobile App"
                >
                  <Download size={15} />
                  <span className="btn-label">Install</span>
                </button>
              )}

              {/* Quick Paste Clipboard Link (Desktop) */}
              <button
                className="action-btn icon-btn desktop-only"
                onClick={onQuickPaste}
                title="Auto-detect & save link from clipboard"
              >
                <Link size={16} />
                <span className="btn-label">Paste Link</span>
              </button>

              {/* New Item Button (Desktop) */}
              <button
                className="action-btn primary-btn desktop-only"
                onClick={onOpenCreateModal}
                title="Create Note, Reminder, or Link (N)"
              >
                <Plus size={18} />
                <span>New Item</span>
              </button>

              {/* Sound Preview Chime (Desktop) */}
              <button
                className="icon-toggle-btn desktop-only"
                onClick={onTestSound}
                title="Test Harmonic Alert Chime"
              >
                <Volume2 size={17} />
              </button>

              {/* Backup & Export (Desktop & Mobile) */}
              <button
                className="icon-toggle-btn"
                onClick={onOpenBackupModal}
                title="Backup, Export & Restore notes"
                aria-label="Backup and export"
              >
                <HardDriveDownload size={17} />
              </button>

              {/* Notification Alert Bell (Desktop) */}
              <button
                className="icon-toggle-btn desktop-only"
                onClick={onRequestNotifications}
                title="Enable browser alerts & sound"
              >
                <Bell size={17} />
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                className="icon-toggle-btn"
                onClick={onToggleTheme}
                title="Toggle Dark/Light Mode"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
