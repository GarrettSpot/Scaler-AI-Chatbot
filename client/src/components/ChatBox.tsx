import React, { useState, useEffect, useRef } from 'react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { PersonaSwitcher } from './PersonaSwitcher';
import { sendMessage, fetchPersonas } from '../services/chatApi';
import type { ChatMessage } from '../services/chatApi';
import './ChatBox.css';

interface Persona {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

/**
 * Main ChatBox component - orchestrates the entire chat experience
 */
export const ChatBox: React.FC = () => {
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersona, setActivePersona] = useState<string>('anshumanSingh');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch personas on component mount
  useEffect(() => {
    const loadPersonas = async () => {
      try {
        const fetchedPersonas = await fetchPersonas();
        setPersonas(fetchedPersonas);
        if (fetchedPersonas.length > 0) {
          setActivePersona(fetchedPersonas[0].id);
        }
      } catch (err) {
        console.error('Failed to load personas:', err);
        setError('Failed to load personas. Please refresh the page.');
      }
    };

    loadPersonas();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handle persona switch
   * Clears conversation when switching to maintain context clarity
   */
  const handlePersonaChange = (personaId: string) => {
    setActivePersona(personaId);
    setMessages([]); // Reset conversation
    setError(null);
  };

  /**
   * Handle sending a message
   * - Add user message to chat
   * - Call API with selected persona
   * - Add assistant response to chat
   */
  const handleSendMessage = async (userMessage: string) => {
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setError(null);
    setIsLoading(true);

    try {
      // Get response from API
      const response = await sendMessage(userMessage, activePersona);

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        persona: activePersona,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${errorMessage}. Please try again.`,
          persona: activePersona,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const activePersonaData = personas.find((p) => p.id === activePersona);

  return (
    <div className="chatbox-container">
      {/* Header */}
      <div className="chatbox-header">
        <h1>🤖 Persona Mentor Chatbot</h1>
        <p>Chat with different mentors with unique perspectives</p>
      </div>

      {/* Persona Switcher */}
      {personas.length > 0 && (
        <PersonaSwitcher
          personas={personas}
          activPersona={activePersona}
          onPersonaChange={handlePersonaChange}
          isLoading={isLoading}
        />
      )}

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 && !error && (
          <div className="empty-state">
            <div className="emoji-large">
              {activePersonaData?.emoji || '🤖'}
            </div>
            <h2>
              Hello! I'm{' '}
              <span style={{ color: activePersonaData?.color }}>
                {activePersonaData?.name}
              </span>
            </h2>
            <p>How can I help you today?</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <Message
            key={idx}
            role={msg.role}
            content={msg.content}
            persona={msg.persona ? activePersonaData?.name : undefined}
            personaEmoji={msg.persona ? activePersonaData?.emoji : undefined}
          />
        ))}

        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSendMessage} isLoading={isLoading} />

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            className="close-error"
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
