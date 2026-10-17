import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Sun,
  Moon,
  X,
  HardDriveDownload,
  Bell,
  Volume2,
  Link as LinkIcon,
  Download,
  Smartphone
} from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        if (isSearchActive) {
          setIsSearchActive(false);
          searchInputRef.current?.blur();
        }
      }
    };

    if (isMenuOpen || isSearchActive) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, isSearchActive]);

  // Sync state badge helper
  const getSyncLabel = () => {
    switch (syncState) {
      case 'connected':
        return `Synced • ${connectedCount}d`;
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'offline':
      default:
        return pendingOfflineCount > 0 ? `Offline (${pendingOfflineCount})` : 'Offline';
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div
          className={`brand-group ${isSearchActive ? 'mobile-hidden' : ''}`}
          onClick={onOpenSyncModal}
          title="Pair devices & cloud sync"
        >
          <div className="brand-logo">
            <span className="brand-bolt">⚡</span>
            <span className="pulse-indicator" />
          </div>
          <div className="brand-text">
            <h1 className="brand-name">
              Nova<span>Sync</span>
            </h1>
          </div>
        </div>

        {/* Global Search */}
        <div className={`search-wrapper ${isSearchActive ? 'is-active' : ''}`}>
          <Search className="search-icon" size={17} />
          <input
            ref={searchInputRef}
            type="text"
            id="searchInput"
            placeholder="Search notes, reminders, links... (⌘K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => {
              if (!searchQuery) setIsSearchActive(false);
            }}
            autoComplete="off"
            aria-label="Search items"
          />
          {searchQuery ? (
            <button
              className="clear-btn"
              onClick={() => {
                onSearchChange('');
                setIsSearchActive(false);
              }}
              title="Clear search"
              aria-label="Clear"
            >
              <X size={15} />
            </button>
          ) : (
            <kbd className="kbd-shortcut">⌘K</kbd>
          )}
        </div>

        {/* Primary Header Controls */}
        <div className={`header-actions ${isSearchActive ? 'mobile-hidden' : ''}`}>
          {/* Real-time Sync Status Pill */}
          <button
            className={`pill-btn sync-btn sync-state-${syncState}`}
            onClick={onOpenSyncModal}
            title={
              syncState === 'connected'
                ? `Realtime cloud sync active across ${connectedCount} devices${latencyMs !== null ? ` (${latencyMs}ms)` : ''}. Click to pair.`
                : 'Click to pair phone or configure sync'
            }
          >
            <span className={`sync-dot ${syncState === 'connected' ? 'live' : syncState}`} />
            <span className="sync-text">{getSyncLabel()}</span>
          </button>

          {/* Primary New Item Button */}
          <button
            className="action-btn primary-btn new-item-btn"
            onClick={onOpenCreateModal}
            title="Create Note, Reminder, or Link (N)"
          >
            <Plus size={16} />
            <span className="btn-text">New</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            className="icon-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* More Actions Menu */}
          <div className="header-menu-container" ref={menuRef}>
            <button
              className={`icon-toggle-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              title="More actions and settings"
              aria-label="More options"
              aria-expanded={isMenuOpen}
            >
              <MoreHorizontal size={18} />
            </button>

            {isMenuOpen && (
              <div className="header-dropdown-menu">
                {/* Mobile/Direct Pair Option */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSyncModal();
                  }}
                >
                  <Smartphone size={16} />
                  <span>Pair Devices (QR)</span>
                </button>

                {/* Paste Link */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onQuickPaste();
                  }}
                >
                  <LinkIcon size={16} />
                  <span>Paste Clipboard Link</span>
                </button>

                <div className="dropdown-divider" />

                {/* Backup & Restore */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenBackupModal();
                  }}
                >
                  <HardDriveDownload size={16} />
                  <span>Backup & Restore</span>
                </button>

                {/* Sound Chime Preview */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onTestSound();
                  }}
                >
                  <Volume2 size={16} />
                  <span>Test Alert Chime</span>
                </button>

                {/* Notifications Permission */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRequestNotifications();
                  }}
                >
                  <Bell size={16} />
                  <span>Enable Notifications</span>
                </button>

                {/* Install App */}
                {installPromptAvailable && (
                  <>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item highlight"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onTriggerInstall();
                      }}
                    >
                      <Download size={16} />
                      <span>Install App</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
