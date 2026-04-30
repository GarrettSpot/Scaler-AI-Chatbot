import React from 'react';
import './Message.css';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  persona?: string;
  personaEmoji?: string;
}

/**
 * Message component - displays individual chat messages
 */
export const Message: React.FC<MessageProps> = ({
  role,
  content,
  persona,
  personaEmoji,
}) => {
  return (
    <div className={`message message-${role}`}>
      <div className="message-content">
        {role === 'assistant' && personaEmoji && (
          <span className="message-emoji">{personaEmoji}</span>
        )}
        <div className="message-text">
          {role === 'assistant' && persona && (
            <div className="message-persona">{persona}</div>
          )}
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};
