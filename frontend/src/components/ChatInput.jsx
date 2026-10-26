import React, { useState } from 'react';
import Sentiment from 'sentiment';
import Picker from 'emoji-picker-react';

const ChatInput = ({ onSend, language = 'en' }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sentiment, setSentiment] = useState(null);

  const sentimentAnalyzer = new Sentiment();

  const handleInputChange = (event) => {
    const message = event.target.value;
    setInput(message);
    setIsTyping(message.length > 0);

    const result = sentimentAnalyzer.analyze(message);
    setSentiment(result.score);
  };

  const handleSendClick = () => {
    const message = input.trim();

    if (!message) return;

    onSend(message);
    setInput('');
    setIsTyping(false);
    setSentiment(null);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendClick();
    }
  };

  const handleClear = () => {
    setInput('');
    setIsTyping(false);
    setSentiment(null);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();

    const voiceLanguages = {
      en: 'en-US',
      ta: 'ta-IN',
      hi: 'hi-IN',
    };

    recognition.lang = voiceLanguages[language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      setIsTyping(true);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleEmojiClick = (emojiData) => {
    setInput((previous) => previous + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const text = {
    en: {
      placeholder: 'Type your message...',
      clear: 'Clear',
      send: 'Send',
      typing: 'Typing...',
      listening: 'Listening...',
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
    },
    ta: {
      placeholder: 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...',
      clear: 'அழி',
      send: 'அனுப்பு',
      typing: 'தட்டச்சு செய்கிறீர்கள்...',
      listening: 'குரலைக் கேட்கிறது...',
      positive: 'நேர்மறை',
      negative: 'எதிர்மறை',
      neutral: 'நடுநிலை',
    },
    hi: {
      placeholder: 'अपना संदेश लिखें...',
      clear: 'मिटाएँ',
      send: 'भेजें',
      typing: 'टाइप कर रहे हैं...',
      listening: 'सुन रहा है...',
      positive: 'सकारात्मक',
      negative: 'नकारात्मक',
      neutral: 'तटस्थ',
    },
  };

  const labels = text[language] || text.en;

  const sentimentLabel =
    sentiment > 0
      ? labels.positive
      : sentiment < 0
        ? labels.negative
        : labels.neutral;

  return (
    <div style={styles.inputContainer}>
      <textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={labels.placeholder}
        style={styles.inputField}
        rows={2}
        aria-label={labels.placeholder}
      />

      <div style={styles.buttonContainer}>
        <button type="button" onClick={handleClear} style={styles.clearButton}>
          {labels.clear}
        </button>

        <button
          type="button"
          onClick={handleSendClick}
          style={styles.sendButton}
          disabled={!input.trim()}
        >
          {labels.send}
        </button>

        <button
          type="button"
          onClick={handleVoiceInput}
          style={styles.voiceButton}
          aria-label="Voice input"
        >
          🎙️
        </button>

        <button
          type="button"
          onClick={() => setShowEmojiPicker((previous) => !previous)}
          style={styles.emojiButton}
          aria-label="Emoji picker"
        >
          😀
        </button>
      </div>

      {showEmojiPicker && (
        <div style={styles.emojiPicker}>
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {isTyping && <p style={styles.typingIndicator}>{labels.typing}</p>}

      {isListening && (
        <p style={styles.typingIndicator}>{labels.listening}</p>
      )}

      {sentiment !== null && (
        <p style={styles.sentimentIndicator}>
          Sentiment: {sentimentLabel}
        </p>
      )}
    </div>
  );
};

const styles = {
  inputContainer: {
    borderTop: '1px solid #e0e0e0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  inputField: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #d1d1d1',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  clearButton: {
    background: 'linear-gradient(145deg, #ff5f6d, #ffc371)',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  sendButton: {
    background: 'linear-gradient(145deg, #36d1dc, #5b86e5)',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  voiceButton: {
    background: 'linear-gradient(145deg, #00c6ff, #0072ff)',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  emojiButton: {
    background: 'linear-gradient(145deg, #f7971e, #ffd200)',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  typingIndicator: {
    fontSize: '13px',
    color: '#888',
    marginTop: '8px',
    textAlign: 'center',
  },
  sentimentIndicator: {
    fontSize: '14px',
    color: '#333',
    marginTop: '10px',
    textAlign: 'center',
  },
  emojiPicker: {
    position: 'absolute',
    bottom: '110%',
    left: '10px',
    zIndex: 1000,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
};

export default ChatInput;