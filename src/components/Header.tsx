import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Sun,
  Moon,
  X,
  ArrowLeft,
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
  onOpenSync?: () => void;
  onOpenSyncModal?: () => void;
  onOpenCreate?: () => void;
  onOpenCreateModal?: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  syncState: SyncState;
  connectedCount: number;
  onOpenBackup?: () => void;
  onOpenBackupModal?: () => void;
  onQuickPaste: () => void;
  onTestSound?: () => void;
  onRequestNotifications?: () => void;
  installPromptAvailable?: boolean;
  onTriggerInstall?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenSync,
  onOpenSyncModal,
  onOpenCreate,
  onOpenCreateModal,
  onToggleTheme,
  theme,
  syncState,
  connectedCount,
  onOpenBackup,
  onOpenBackupModal,
  onQuickPaste,
  onTestSound,
  onRequestNotifications,
  installPromptAvailable,
  onTriggerInstall
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const handleSyncClick = onOpenSync || onOpenSyncModal || (() => {});
  const handleCreateClick = onOpenCreate || onOpenCreateModal || (() => {});
  const handleBackupClick = onOpenBackup || onOpenBackupModal || (() => {});

  // Focus mobile input on open
  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [isMobileSearchOpen]);

  // Handle outside click & escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const getSyncDotClass = () => {
    if (syncState === 'connected') return 'live';
    if (syncState === 'connecting' || syncState === 'reconnecting') return 'connecting';
    return 'offline';
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Mobile Search Active Overlay */}
        {isMobileSearchOpen ? (
          <div className="mobile-search-bar active">
            <button
              className="icon-btn"
              onClick={() => {
                setIsMobileSearchOpen(false);
                onSearchChange('');
              }}
              title="Close search"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="mobile-search-input-wrap">
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search notes, reminders, links..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  className="clear-btn"
                  onClick={() => onSearchChange('')}
                  title="Clear"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Brand Logo */}
            <div className="brand-group" onClick={handleSyncClick} title="Pair device & cloud status">
              <div className="brand-logo">
                <span className="brand-bolt">⚡</span>
                <span className="pulse-indicator" />
              </div>
              <h1 className="brand-name">
                Nova<span>Sync</span>
              </h1>
            </div>

            {/* Desktop Center Search Bar */}
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                id="searchInput"
                placeholder="Search notes, reminders, tags... (⌘K)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
                aria-label="Search items"
              />
              {searchQuery ? (
                <button className="clear-btn" onClick={() => onSearchChange('')} title="Clear">
                  <X size={14} />
                </button>
              ) : (
                <kbd className="kbd-shortcut">⌘K</kbd>
              )}
            </div>

            {/* Header Right Action Items */}
            <div className="header-actions">
              {/* Mobile Search Toggle Icon */}
              <button
                className="icon-btn mobile-only-btn"
                onClick={() => setIsMobileSearchOpen(true)}
                title="Search"
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              {/* Real-time Sync Status Pill */}
              <button
                className="sync-pill-btn"
                onClick={handleSyncClick}
                title="Cloud sync status • Click to pair phone or change room"
              >
                <span className={`sync-dot ${getSyncDotClass()}`} />
                <span>{syncState === 'connected' ? `Synced • ${connectedCount}d` : syncState}</span>
              </button>

              {/* Desktop + New Button */}
              <button
                className="primary-add-btn"
                onClick={handleCreateClick}
                title="Create Note, Reminder, or Link"
              >
                <Plus size={16} />
                <span>New</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                className="icon-btn"
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* More Actions Dropdown */}
              <div className="menu-anchor" ref={menuRef}>
                <button
                  className="icon-btn"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  title="More actions"
                  aria-label="More actions"
                >
                  <MoreHorizontal size={17} />
                </button>

                {isMenuOpen && (
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-action"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSyncClick();
                      }}
                    >
                      <Smartphone size={15} />
                      <span>Pair Devices (QR)</span>
                    </button>
                    <button
                      className="dropdown-action"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onQuickPaste();
                      }}
                    >
                      <LinkIcon size={15} />
                      <span>Paste Clipboard Link</span>
                    </button>
                    <div className="dropdown-sep" />
                    <button
                      className="dropdown-action"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleBackupClick();
                      }}
                    >
                      <HardDriveDownload size={15} />
                      <span>Backup & Restore</span>
                    </button>
                    {onTestSound && (
                      <button
                        className="dropdown-action"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onTestSound();
                        }}
                      >
                        <Volume2 size={15} />
                        <span>Test Alert Sound</span>
                      </button>
                    )}
                    {onRequestNotifications && (
                      <button
                        className="dropdown-action"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onRequestNotifications();
                        }}
                      >
                        <Bell size={15} />
                        <span>Notifications</span>
                      </button>
                    )}
                    {installPromptAvailable && (
                      <>
                        <div className="dropdown-sep" />
                        <button
                          className="dropdown-action"
                          style={{ color: 'var(--accent-cyan)' }}
                          onClick={() => {
                            setIsMenuOpen(false);
                            onTriggerInstall?.();
                          }}
                        >
                          <Download size={15} />
                          <span>Install Mobile App</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
