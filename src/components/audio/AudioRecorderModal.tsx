import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, X, Check, Disc } from 'lucide-react';
import { apiUploadAudio } from '../../services/api';

interface AudioRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAudioRecorded: (audioUrl: string, duration: number, title?: string) => void;
}

export const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
  isOpen,
  onClose,
  onAudioRecorded,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
    }
    return () => cleanup();
  }, [isOpen]);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    setIsRecording(false);
    setDuration(0);
    setAudioBlob(null);
    setNoteTitle('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Setup Web Audio API Analyser for real-time waveform visualization
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawVisualizer = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        animationFrameRef.current = requestAnimationFrame(drawVisualizer);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 1.8;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
          ctx.fillStyle = '#D97706'; // Warm ochre
          ctx.beginPath();
          ctx.roundRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight + 2, 4);
          ctx.fill();
          x += barWidth + 1;
        }
      };

      drawVisualizer();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access is required to record voice notes.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  const handleSave = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    let finalUrl = URL.createObjectURL(audioBlob);

    try {
      // Try uploading to backend
      const uploadRes = await apiUploadAudio(audioBlob, `memo_${Date.now()}.webm`);
      finalUrl = uploadRes.url;
    } catch {
      // Offline fallback: keep local blob url or base64
    }

    setIsUploading(false);
    onAudioRecorded(finalUrl, duration, noteTitle.trim() || 'Voice Memo');
    onClose();
  };

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FFFFFF] border border-hairline w-full max-w-md rounded-t-sheet sm:rounded-sheet p-6 shadow-sheet relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ink-tertiary hover:text-ink-primary rounded-full hover:bg-recessed"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ochre/10 text-ochre text-xs font-semibold tracking-wider uppercase mb-2">
            <Disc className={`w-3.5 h-3.5 ${isRecording ? 'animate-spin text-red-600' : ''}`} />
            Voice Memo Dictation
          </div>
          <h3 className="font-serif text-2xl text-ink-primary">Capture Voice Reflection</h3>
          <p className="text-sm text-ink-secondary mt-1">Audio recordings are preserved in your archival vault.</p>
        </div>

        {/* Real-time frequency visualizer canvas */}
        <div className="h-28 bg-[#FAF8F5] border border-hairline rounded-2xl flex items-center justify-center p-3 relative overflow-hidden mb-6">
          <canvas
            ref={canvasRef}
            width={340}
            height={90}
            className="w-full h-full object-contain"
          />
          {!isRecording && !audioBlob && (
            <span className="absolute text-sm text-ink-tertiary font-serif italic">
              Tap the amber button below to begin recording
            </span>
          )}
        </div>

        {/* Timer display */}
        <div className="text-center mb-6">
          <div className="text-3xl font-mono font-medium text-ink-primary tabular-nums">
            {formatTimer(duration)}
          </div>
          {isRecording && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 mt-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              Recording live microphone input...
            </div>
          )}
        </div>

        {/* Input for Title if finished recording */}
        {audioBlob && (
          <div className="mb-6">
            <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
              Note Title (Optional)
            </label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Design Sync Reflection, Yanaka Walk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-hairline bg-recessed focus:bg-white focus:outline-none focus:border-ochre text-sm"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="px-6 py-3.5 rounded-full bg-ochre hover:bg-ochre-dark text-white font-medium flex items-center gap-2 shadow-lifted active:scale-95 transition-all"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2 shadow-lifted active:scale-95 transition-all animate-pulse"
            >
              <Square className="w-5 h-5 fill-white" />
              Finish Recording
            </button>
          )}

          {audioBlob && (
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => {
                  setAudioBlob(null);
                  setDuration(0);
                  startRecording();
                }}
                className="flex-1 py-3 rounded-xl border border-hairline text-ink-secondary hover:bg-recessed text-sm font-medium"
              >
                Retake
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="flex-1 py-3 rounded-xl bg-ochre hover:bg-ochre-dark text-white text-sm font-medium flex items-center justify-center gap-2 shadow-lifted"
              >
                <Check className="w-4 h-4" />
                {isUploading ? 'Saving...' : 'Save to Vault'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
