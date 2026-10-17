import React, { useState, useEffect } from 'react';
import { NetworkInfo, DeviceInfo, Item, SyncState } from '../types';
import { setCustomServerUrl, getBaseApiUrl, checkServerHealth } from '../services/api';
import { X, Copy, Server, Smartphone, QrCode, HardDrive, RefreshCw, CheckCircle2, AlertCircle, Cloud, Globe } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkInfo: NetworkInfo | null;
  room: string;
  onSwitchRoom: (newRoom: string) => void;
  connectedCount: number;
  devices: DeviceInfo[];
  syncState: SyncState;
  latencyMs: number | null;
  items: Item[];
  onImportItems: (imported: Item[]) => void;
  onCopyUrl: (url: string) => void;
  onServerConfigChanged: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  networkInfo,
  room,
  onSwitchRoom,
  connectedCount,
  devices,
  syncState,
  latencyMs,
  items,
  onImportItems,
  onCopyUrl,
  onServerConfigChanged
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'backend' | 'backup' | 'guide'>('qr');
  const [inputRoom, setInputRoom] = useState(room);
  const [customServerInput, setCustomServerInput] = useState('');
  const [testResult, setTestResult] = useState<{ testing: boolean; ok?: boolean; latency?: number; error?: string } | null>(null);

  useEffect(() => {
    setInputRoom(room);
    setCustomServerInput(getBaseApiUrl());
  }, [room, isOpen]);

  if (!isOpen) return null;

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoom.trim()) {
      onSwitchRoom(inputRoom.trim().toUpperCase());
    }
  };

  const handleSaveCustomServer = () => {
    setCustomServerUrl(customServerInput.trim());
    onServerConfigChanged();
  };

  const handleTestBackend = async () => {
    setTestResult({ testing: true });
    const target = customServerInput.trim();
    const res = await checkServerHealth(target || undefined);
    setTestResult({
      testing: false,
      ok: res.ok,
      latency: res.latencyMs,
      error: res.error
    });
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `novasync_backup_room_${room}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportMarkdown = () => {
    let md = `# NovaSync Export — Room: ${room}\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n`;
    for (const item of items) {
      md += `## [${item.type.toUpperCase()}] ${item.title}\n`;
      if (item.url) md += `**Link:** [${item.url}](${item.url})\n\n`;
      if (item.due_date) md += `**Due:** ${new Date(item.due_date).toLocaleString()}\n\n`;
      if (item.content) md += `${item.content}\n\n`;
      if (item.checklist && item.checklist.length > 0) {
        md += `### Checklist:\n`;
        item.checklist.forEach(t => {
          md += `- [${t.done ? 'x' : ' '}] ${t.text}\n`;
        });
        md += `\n`;
      }
      if (item.tags && item.tags.length > 0) {
        md += `Tags: ${item.tags.map(t => `#${t}`).join(' ')}\n\n`;
      }
      md += `---\n\n`;
    }

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `novasync_notes_room_${room}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportItems(parsed);
          alert(`Successfully imported ${parsed.length} items into Room ${room}!`);
          onClose();
        } else {
          alert('Invalid backup format: root must be an array of items.');
        }
      } catch (err: any) {
        alert('Failed to parse backup JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card sync-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="sync-modal-title-group">
            <div className="modal-icon-badge">⚡📱</div>
            <div>
              <h3>24/7 Cloud Cross-Device Pairing</h3>
              <p>Instant multi-device sync without any local server required</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="sync-modal-tabs">
          <button
            className={`sync-tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            <QrCode size={15} />
            <span>Pair Phone (QR)</span>
          </button>
          <button
            className={`sync-tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
            onClick={() => setActiveTab('backend')}
          >
            <Cloud size={15} />
            <span>Cloud Sync Status</span>
          </button>
          <button
            className={`sync-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            <Smartphone size={15} />
            <span>Instagram Share Guide</span>
          </button>
          <button
            className={`sync-tab-btn ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            <HardDrive size={15} />
            <span>Backup & Export</span>
          </button>
        </div>

        <div className="sync-modal-body">
          {/* TAB 1: QR & PAIRING */}
          {activeTab === 'qr' && (
            <div className="tab-pane">
              <div className="qr-showcase">
                <div className="qr-frame">
                  {networkInfo?.qrDataUrl ? (
                    <img src={networkInfo.qrDataUrl} alt="Scan QR Code to open NovaSync on your phone" />
                  ) : (
                    <div className="qr-loading">Generating QR Code...</div>
                  )}
                </div>
                <div className="qr-caption">
                  <strong>Scan with Phone Camera (4G / 5G / Wi-Fi)</strong>
                  <span>
                    Point your iPhone or Android camera at this QR code to open NovaSync directly in the cloud. Notes, reminders, and shared links sync bidirectionally in milliseconds!
                  </span>
                  <div className="sync-mode-badge">
                    <Cloud size={13} style={{ display: 'inline', marginRight: 4 }} />
                    24/7 Cloud Relay Active • Zero Local Server Needed
                  </div>
                </div>
              </div>

              {/* Worldwide Public Sync Link */}
              <div className="sync-link-box">
                <label>Hugging Face 24/7 Cloud App Link (Open on Any Mobile Device):</label>
                <div className="copy-url-row">
                  <input type="text" readOnly value={networkInfo?.syncUrl || 'https://nandhaalagesan248-novasync.static.hf.space/?room=' + room} />
                  <button
                    type="button"
                    className="pill-btn primary small"
                    onClick={() => onCopyUrl(networkInfo?.syncUrl || 'https://nandhaalagesan248-novasync.static.hf.space/?room=' + room)}
                  >
                    <Copy size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Room Switcher */}
              <div className="room-switcher-box">
                <label>Active Sync Room Code:</label>
                <form onSubmit={handleRoomSubmit} className="room-input-row">
                  <input
                    type="text"
                    placeholder="Enter Room (e.g. MAIN, WORK, PERSONAL)"
                    value={inputRoom}
                    onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
                  />
                  <button type="submit" className="pill-btn secondary small">
                    Switch Room
                  </button>
                </form>
                <span className="room-hint">
                  All devices configured with Room <strong>{room}</strong> receive instant real-time updates.
                </span>
              </div>

              {/* Connected Devices Presence */}
              <div className="connected-devices-box">
                <div className="devices-header">
                  <h4>Active Devices in Room ({connectedCount})</h4>
                  <span className={`live-tag ${syncState}`}>
                    ● {syncState === 'connected' ? '24/7 Cloud Live' : syncState}
                  </span>
                </div>
                <div className="devices-list">
                  {devices.length > 0 ? (
                    devices.map((dev) => (
                      <span key={dev.id} className="device-pill">
                        <span className="device-dot"></span>
                        <span>{dev.name} ({dev.platform})</span>
                      </span>
                    ))
                  ) : (
                    <span className="device-pill">
                      <span className="device-dot"></span>
                      <span>This Device ({typeof navigator !== 'undefined' ? navigator.platform || 'Desktop' : 'Web'})</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLOUD & BACKEND */}
          {activeTab === 'backend' && (
            <div className="tab-pane">
              <div className="backend-status-card">
                <div className="backend-status-header">
                  <div>
                    <h4>24/7 Autonomous Cloud Relay</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      NovaSync operates autonomously 24/7 in Hugging Face with zero local machine or PC server required.
                    </p>
                  </div>
                  <div className={`status-pill ${syncState}`}>
                    {syncState === 'connected' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{syncState.toUpperCase()} {latencyMs !== null ? `(${latencyMs}ms)` : ''}</span>
                  </div>
                </div>

                <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.83rem', color: 'var(--text-main)' }}>
                  <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 4 }}>
                    ✓ 100% Serverless Cloud Mode Operational
                  </div>
                  <div>
                    Your notes, reminders, and shared links are persisted in your device storage and synchronized in real time across all paired devices via global WebSocket channels. You can turn off your computer at any time without disrupting mobile access.
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Custom Backend Server (Optional for self-hosters):
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Leave blank for 24/7 Cloud Relay, or enter https://your-server.com"
                      value={customServerInput}
                      onChange={(e) => setCustomServerInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 8,
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button type="button" className="pill-btn primary small" onClick={handleSaveCustomServer}>
                      Save
                    </button>
                    <button
                      type="button"
                      className="pill-btn secondary small"
                      onClick={handleTestBackend}
                      disabled={testResult?.testing}
                    >
                      <RefreshCw size={13} className={testResult?.testing ? 'spin' : ''} style={{ display: 'inline', marginRight: 4 }} />
                      Ping
                    </button>
                  </div>
                </div>

                {/* Test Feedback */}
                {testResult && (
                  <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', background: testResult.ok ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: `1px solid ${testResult.ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                    {testResult.testing ? (
                      <span>Testing latency...</span>
                    ) : testResult.ok ? (
                      <span style={{ color: '#10b981' }}>
                        ✓ Cloud Relay online! Round-trip latency: <strong>{testResult.latency}ms</strong>. Realtime synchronization operational.
                      </span>
                    ) : (
                      <span style={{ color: '#ef4444' }}>
                        ✗ Latency check notice: {testResult.error || 'Connection failed'}.
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>🚀 24/7 Cloud Architecture:</strong>
                <ul style={{ paddingLeft: 18, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <li><strong>Hosting:</strong> Free, permanent 24/7 static cloud hosting on Hugging Face at <code>nandhaalagesan248/novasync</code>.</li>
                  <li><strong>Realtime Sync:</strong> Instant cross-device message broadcast via global WebSocket relay.</li>
                  <li><strong>Zero Local Server:</strong> No computer, no terminal, and no local process required.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: INSTAGRAM GUIDE */}
          {activeTab === 'guide' && (
            <div className="tab-pane">
              <div className="share-sheet-guide">
                <h4>
                  <Smartphone size={16} style={{ display: 'inline', marginRight: 6 }} />
                  How to Save Links & Instagram Reels Directly on Mobile:
                </h4>
                <ol style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li>
                    <strong>Step 1: Install NovaSync as Mobile App</strong>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                      Open the NovaSync link on your phone in Chrome (Android) or Safari (iPhone), and tap <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                    </p>
                  </li>
                  <li>
                    <strong>Step 2: Tap Share in Instagram or Browser</strong>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                      While watching any Instagram Reel or reading any website article, tap the native <strong>Share</strong> button.
                    </p>
                  </li>
                  <li>
                    <strong>Step 3: Select NovaSync</strong>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                      Choose <strong>NovaSync</strong> from your phone's share sheet. NovaSync automatically extracts the reel shortcode, title, thumbnail, and syncs it to all your devices in real-time!
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & EXPORT */}
          {activeTab === 'backup' && (
            <div className="tab-pane">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Export Room Notes & Reminders</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>
                    Download a full snapshot of your {items.length} items from Room <strong>{room}</strong>.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" className="pill-btn primary small" onClick={handleExportJson}>
                      <HardDrive size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Export JSON Backup
                    </button>
                    <button type="button" className="pill-btn secondary small" onClick={handleExportMarkdown}>
                      Export Markdown (.md)
                    </button>
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Restore from JSON Backup</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>
                    Restore or import notes into Room <strong>{room}</strong>.
                  </p>
                  <label className="pill-btn secondary small" style={{ display: 'inline-flex', cursor: 'pointer', width: 'fit-content' }}>
                    <span>Choose JSON Backup File...</span>
                    <input type="file" accept=".json" onChange={handleFileImport} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
