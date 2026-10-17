import React, { useState } from 'react';
import { ItemType } from '../types';

interface QuickAddBarProps {
  onQuickSubmit: (text: string, type: ItemType, detectedUrl: string | null) => void;
  onOpenWithUrl: (url: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  searchQuery,
  onSearchChange
}) => {
  const [isListening, setIsListening] = useState(false);

  // Web Speech API Voice Recognition
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onSearchChange(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech error:', e);
      setIsListening(false);
    }
  };

  return (
    <div className="search-discovery-bar">
      <div className="search-pill-container">
        <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: '20px' }}>
          search
        </span>
        <input
          id="searchInput"
          type="text"
          className="search-pill-input"
          placeholder="Search notes, tags, or voice..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />

        {searchQuery ? (
          <button
            type="button"
            className="search-icon-btn"
            onClick={() => onSearchChange('')}
            title="Clear"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              close
            </span>
          </button>
        ) : null}

        <button
          type="button"
          className={`search-icon-btn ${isListening ? 'recording' : ''}`}
          onClick={handleVoiceSearch}
          title={isListening ? 'Listening...' : 'Voice Search'}
          aria-label="Voice search"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            mic
          </span>
        </button>
      </div>
    </div>
  );
};
