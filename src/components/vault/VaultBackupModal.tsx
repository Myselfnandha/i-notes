import React, { useState } from 'react';
import { X, Download, Upload, RefreshCw, AlertTriangle, Check, HardDrive, Trash2 } from 'lucide-react';
import { dbExportVault, dbImportVault, dbClearVault } from '../../db';
import { triggerVaultSync } from '../../services/syncService';

interface VaultBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const VaultBackupModal: React.FC<VaultBackupModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      const json = await dbExportVault();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inotes_vault_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage('Vault successfully exported to JSON backup file!');
    } catch (e: any) {
      setStatusMessage(`Export error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setIsProcessing(true);
        const text = event.target?.result as string;
        const res = await dbImportVault(text);
        setStatusMessage(`Restored ${res.notes} notes and ${res.checklists} checklists!`);
        onRefreshData();
      } catch (err: any) {
        setStatusMessage(`Import failed: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSyncNow = async () => {
    setIsProcessing(true);
    setStatusMessage('Syncing with backend...');
    const ok = await triggerVaultSync();
    if (ok) {
      setStatusMessage('Sync complete! All notes and checklists aligned.');
      onRefreshData();
    } else {
      setStatusMessage('Offline: Changes are safely stored in IndexedDB.');
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-hairline rounded-sheet p-6 w-full max-w-md shadow-sheet relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ink-tertiary hover:text-ink-primary rounded-full hover:bg-recessed"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-ochre/15 flex items-center justify-center text-ochre">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-ink-primary">Vault Archival Manager</h3>
            <p className="text-xs text-ink-secondary">Backup, restore, and cloud synchronization</p>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-ochre/10 border border-ochre/20 text-xs text-ink-primary flex items-center gap-2">
            <Check className="w-4 h-4 text-ochre flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Export JSON */}
          <button
            onClick={handleExport}
            disabled={isProcessing}
            className="w-full p-3.5 rounded-2xl bg-recessed hover:bg-white border border-hairline text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-ochre" />
              <div>
                <h4 className="font-medium text-sm text-ink-primary">Export Vault Backup</h4>
                <p className="text-[11px] text-ink-tertiary">Download full JSON snapshot of notes & checklists</p>
              </div>
            </div>
            <span className="text-xs text-ochre group-hover:translate-x-0.5 transition-transform">→</span>
          </button>

          {/* Import JSON */}
          <label className="w-full p-3.5 rounded-2xl bg-recessed hover:bg-white border border-hairline text-left flex items-center justify-between transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
              <Upload className="w-4 h-4 text-[#51604e]" />
              <div>
                <h4 className="font-medium text-sm text-ink-primary">Restore from JSON</h4>
                <p className="text-[11px] text-ink-tertiary">Import previously saved vault backup file</p>
              </div>
            </div>
            <span className="text-xs text-[#51604e] group-hover:translate-x-0.5 transition-transform">→</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {/* Sync Now */}
          <button
            onClick={handleSyncNow}
            disabled={isProcessing}
            className="w-full p-3.5 rounded-2xl bg-recessed hover:bg-white border border-hairline text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className={`w-4 h-4 text-ochre ${isProcessing ? 'animate-spin' : ''}`} />
              <div>
                <h4 className="font-medium text-sm text-ink-primary">Synchronize Now</h4>
                <p className="text-[11px] text-ink-tertiary">Push local changes and pull latest server revisions</p>
              </div>
            </div>
            <span className="text-xs text-ochre group-hover:translate-x-0.5 transition-transform">→</span>
          </button>

          {/* Clear Vault / Reset */}
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to clear your vault? This will delete all notes and checklists permanently.')) {
                setIsProcessing(true);
                await dbClearVault();
                onRefreshData();
                setStatusMessage('Vault has been cleared and reset to a pristine state.');
                setIsProcessing(false);
              }
            }}
            disabled={isProcessing}
            className="w-full p-3.5 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-200 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-600" />
              <div>
                <h4 className="font-medium text-sm text-red-700">Clear Vault (Reset)</h4>
                <p className="text-[11px] text-red-500">Permanently empty all notes, checklists, and folders</p>
              </div>
            </div>
            <span className="text-xs text-red-600 group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-hairline text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-ink-primary text-white text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
