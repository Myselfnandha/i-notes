import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  CheckSquare,
  Folder as FolderIcon,
  Archive,
  Download,
  Wifi,
  WifiOff,
  HardDrive,
  Trash2,
  Sparkles,
  Plus
} from 'lucide-react';
import { ActiveTab, Folder } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  syncStatus: string;
  folders: Folder[];
  onSelectFolder: (folder: Folder | null) => void;
  onOpenVaultManager: () => void;
  onNewNote: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab,
  onTabChange,
  syncStatus,
  folders,
  onSelectFolder,
  onOpenVaultManager,
  onNewNote,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col md:flex-row text-ink-primary">
      {/* Desktop Navigation Sidebar (>= 768px) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-hairline p-5 sticky top-0 h-screen overflow-y-auto">
        {/* Brand header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-hairline">
          <BrandLogo size={42} />
          <div>
            <h1 className="font-serif text-lg font-bold text-ink-primary leading-tight">
              i Notes
            </h1>
            <p className="text-[11px] font-mono tracking-wider text-ink-tertiary">
              ARCHIVAL V2.4
            </p>
          </div>
        </div>

        {/* Quick New Note Button */}
        <button
          onClick={onNewNote}
          className="w-full mb-6 py-2.5 px-4 rounded-xl bg-ochre hover:bg-ochre-dark text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lifted active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Note
        </button>

        {/* Nav Links */}
        <nav className="space-y-1 mb-6">
          <button
            onClick={() => onTabChange('notes')}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
              activeTab === 'notes'
                ? 'bg-ochre/10 text-ochre font-semibold'
                : 'text-ink-secondary hover:bg-recessed'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Notes Feed
          </button>

          <button
            onClick={() => onTabChange('checklists')}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
              activeTab === 'checklists'
                ? 'bg-ochre/10 text-ochre font-semibold'
                : 'text-ink-secondary hover:bg-recessed'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Checklists & Tasks
          </button>

          <button
            onClick={() => onTabChange('folders')}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
              activeTab === 'folders'
                ? 'bg-ochre/10 text-ochre font-semibold'
                : 'text-ink-secondary hover:bg-recessed'
            }`}
          >
            <FolderIcon className="w-4 h-4" />
            Folders & Vault
          </button>

          <button
            onClick={() => onTabChange('archive')}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
              activeTab === 'archive'
                ? 'bg-ochre/10 text-ochre font-semibold'
                : 'text-ink-secondary hover:bg-recessed'
            }`}
          >
            <Archive className="w-4 h-4" />
            Archive Box
          </button>
        </nav>

        {/* Folders tree summary */}
        <div className="mb-6 flex-1">
          <div className="text-[10px] uppercase font-semibold text-ink-tertiary px-3 mb-2 tracking-wider">
            Folders
          </div>
          <div className="space-y-1">
            {folders.slice(0, 5).map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  onSelectFolder(f);
                  onTabChange('notes');
                }}
                className="w-full px-3 py-1.5 text-left text-xs text-ink-secondary hover:bg-recessed rounded-lg flex items-center gap-2 truncate"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: f.color || '#8d4b00' }}
                />
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer status */}
        <div className="pt-4 border-t border-hairline space-y-2">
          <div className="flex items-center justify-between text-[11px] text-ink-secondary">
            <span className="flex items-center gap-1.5 font-medium">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
              Vault Active
            </span>
          </div>

          <button
            onClick={onOpenVaultManager}
            className="w-full py-2 px-3 rounded-lg bg-recessed hover:bg-hairline text-[11px] font-medium text-ink-secondary flex items-center justify-center gap-1.5 transition-colors"
          >
            <HardDrive className="w-3.5 h-3.5 text-ochre" />
            Manage Vault Backup
          </button>
        </div>
      </aside>

      {/* Main App Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* PWA Install Notification Banner */}
        {showInstallBanner && (
          <div className="bg-ochre/15 border-b border-ochre/20 px-4 py-2.5 flex items-center justify-between text-xs text-[#8d4b00]">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Install <strong>i Notes</strong> for offline mobile & desktop access</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1 bg-ochre text-white font-medium rounded-lg shadow-sm hover:bg-ochre-dark"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-ink-tertiary hover:text-ink-primary px-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <main className="flex-1">{children}</main>

        {/* Mobile Bottom Navigation Bar (Screen 1 & 2 bottom tabs) */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-hairline py-2 px-4 shadow-dock flex items-center justify-around">
          <button
            onClick={() => onTabChange('notes')}
            className={`flex flex-col items-center gap-1 text-[11px] transition-colors ${
              activeTab === 'notes' ? 'text-ochre font-semibold' : 'text-ink-tertiary hover:text-ink-primary'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span>Notes</span>
          </button>

          <button
            onClick={() => onTabChange('checklists')}
            className={`flex flex-col items-center gap-1 text-[11px] transition-colors ${
              activeTab === 'checklists' ? 'text-ochre font-semibold' : 'text-ink-tertiary hover:text-ink-primary'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span>Checklists</span>
          </button>

          <button
            onClick={() => onTabChange('folders')}
            className={`flex flex-col items-center gap-1 text-[11px] transition-colors ${
              activeTab === 'folders' ? 'text-ochre font-semibold' : 'text-ink-tertiary hover:text-ink-primary'
            }`}
          >
            <FolderIcon className="w-5 h-5" />
            <span>Folders</span>
          </button>

          <button
            onClick={() => onTabChange('archive')}
            className={`flex flex-col items-center gap-1 text-[11px] transition-colors ${
              activeTab === 'archive' ? 'text-ochre font-semibold' : 'text-ink-tertiary hover:text-ink-primary'
            }`}
          >
            <Archive className="w-5 h-5" />
            <span>Archive</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
