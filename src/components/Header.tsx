import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Sun,
  Moon,
  QrCode,
  HardDriveDownload,
  Upload,
  Volume2,
  Download,
  Share2,
  Sparkles,
  FolderOpen
} from 'lucide-react';
import { SyncState } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSync: () => void;
  onOpenCreate: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  syncState: SyncState;
  room: string;
  connectedCount: number;
  onOpenBackup?: () => void;
  onTestSound?: () => void;
  installPromptAvailable?: boolean;
  onTriggerInstall?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenSync,
  onOpenCreate,
  onToggleTheme,
  theme,
  syncState,
  room,
  connectedCount,
  onOpenBackup,
  onTestSound,
  installPromptAvailable,
  onTriggerInstall
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Live formatted date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header className="editorial-header pt-safe">
      <div className="header-inner">
        {/* Left: Brand Monogram */}
        <div className="brand-section" onClick={onOpenSync} title="Folio · NovaSync Workspace">
          <div className="brand-seal">F</div>
          <div className="brand-text">
            <span className="brand-title">Folio</span>
            <span className="brand-subtitle">Editorial Notes</span>
          </div>
        </div>

        {/* Center: Greeting & Date */}
        <div className="header-center-info">
          <span className="greeting-text">{getGreeting()}, Nandha</span>
          <span className="live-date-text font-mono">
            {formattedDate} · {formattedTime}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="header-right-actions">
          {/* Sync Status Badge */}
          <button
            className="header-sync-chip"
            onClick={onOpenSync}
            title={`Synced with room ${room} (${connectedCount} devices connected)`}
          >
            <span className={`sync-pulse ${syncState}`} />
            <span className="font-mono">{room}</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="header-icon-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Paper' : 'Switch to Dark Soot'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Settings / Menu Anchor */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              className="header-icon-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Preferences & Tools"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                tune
              </span>
            </button>

            {isMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 220,
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--card-hairline)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-modal)',
                  padding: 6,
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: 'var(--on-surface)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSync();
                  }}
                >
                  <QrCode size={15} style={{ color: 'var(--primary)' }} />
                  <span>Pair Devices & QR</span>
                </button>

                {onOpenBackup && (
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--on-surface)',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenBackup();
                    }}
                  >
                    <HardDriveDownload size={15} style={{ color: 'var(--secondary)' }} />
                    <span>Backup & Export JSON</span>
                  </button>
                )}

                {onTestSound && (
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--on-surface)',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                    onClick={() => {
                      onTestSound();
                    }}
                  >
                    <Volume2 size={15} style={{ color: 'var(--tertiary)' }} />
                    <span>Test Reminder Chime</span>
                  </button>
                )}

                {installPromptAvailable && onTriggerInstall && (
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onTriggerInstall();
                    }}
                  >
                    <Download size={15} />
                    <span>Install App on Phone</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
