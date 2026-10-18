import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface WaveformPlayerProps {
  audioUrl?: string | null;
  duration?: number;
  interactive?: boolean;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioUrl,
  duration = 42,
  interactive = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-generated pleasing tactile wave heights matching the design
  const barHeights = [40, 65, 95, 100, 75, 85, 90, 70, 80, 50, 45, 60, 40, 25];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.05;
        });
      }, 200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;

    if (audioUrl && audioUrl.startsWith('http') || (audioUrl && audioUrl.startsWith('/api/'))) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setProgress(0);
        };
      }
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      // Demo simulated playback
      setIsPlaying(!isPlaying);
      if (progress >= 1) setProgress(0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentTime = Math.round(progress * duration);

  return (
    <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#EBE8E1] rounded-2xl px-3.5 py-2.5 w-full select-none">
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        className="w-8 h-8 rounded-full bg-[#E0A96D]/20 hover:bg-[#E0A96D]/30 text-[#8d4b00] flex items-center justify-center transition-transform active:scale-95 flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-[#8d4b00]" />
        ) : (
          <Play className="w-4 h-4 fill-[#8d4b00] ml-0.5" />
        )}
      </button>

      {/* Waveform bars */}
      <div className="flex items-center gap-[3px] flex-1 h-7 cursor-pointer" onClick={() => setProgress(Math.random())}>
        {barHeights.map((h, i) => {
          const isPassed = (i / barHeights.length) <= progress;
          return (
            <div
              key={i}
              className={`w-[3px] rounded-full transition-all duration-150 ${
                isPassed ? 'bg-[#8d4b00]' : 'bg-[#D5CEBF]'
              }`}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>

      <span className="text-[12px] font-mono text-ink-secondary tabular-nums flex-shrink-0">
        {isPlaying ? formatTime(currentTime) : formatTime(duration)}
      </span>
    </div>
  );
};
