/**
 * API service for chatbot backend
 * Handles all communication with the /api/chat endpoint
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  persona?: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  persona: string;
  error?: string;
}

/**
 * Send a message to the chatbot
 * @param message - User message
 * @param persona - Selected persona ID
 * @returns Promise with assistant response
 */
export async function sendMessage(
  message: string,
  persona: string
): Promise<ChatResponse> {
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }

  if (!persona) {
    throw new Error('Persona must be selected');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        persona: persona,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
}

/**
 * Fetch available personas
 * @returns Promise with list of personas
 */
export async function fetchPersonas() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/personas`);

    if (!response.ok) {
      throw new Error(`Failed to fetch personas: ${response.statusText}`);
    }

    const data = await response.json();
    return data.personas || [];
  } catch (error) {
    console.error('Fetch Personas Error:', error);
    throw error;
  }
}
