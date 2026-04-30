import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

/**
 * Message input component with send functionality
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={isLoading}
          className="message-textarea"
          maxLength={2000}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="send-button"
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="loading-spinner">⏳</span>
          ) : (
            <span>Send</span>
          )}
        </button>
      </div>
      <div className="char-count">
        {message.length} / 2000
      </div>
    </div>
  );
};
