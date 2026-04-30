import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSystemPrompt, getAllPersonas } from './personaPrompts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/chat
 * Send a message and get a response from the selected persona
 *
 * Request body:
 * {
 *   "message": "user message",
 *   "persona": "anshumanSingh" | "abhimanyuSaxena" | "kshitijMishra"
 * }
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, persona } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (!persona || typeof persona !== 'string') {
      return res.status(400).json({ error: 'Persona must be specified' });
    }

    // Sanitize and validate message
    const sanitizedMessage = message.trim().slice(0, 2000); // Limit to 2000 chars

    // Get system prompt for the selected persona
    let systemPrompt;
    try {
      systemPrompt = getSystemPrompt(persona);
    } catch (err) {
      return res.status(400).json({ error: `Invalid persona: ${persona}` });
    }

    // Call Gemini API with persona system prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'You are ' + systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I will follow these instructions and persona traits.' }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.9,
      },
    });
    
    const result = await chat.sendMessage(sanitizedMessage);
    const assistantMessage = result.response.text();

    res.json({
      success: true,
      message: assistantMessage,
      persona: persona
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    // Handle API key errors
    if (error.message?.includes('API_KEY') || error.message?.includes('api_key')) {
      return res.status(401).json({
        error: 'Invalid API key. Please check GEMINI_API_KEY in .env'
      });
    }

    // Handle rate limiting or other API errors
    if (error.status === 429 || error.message?.includes('rate')) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to generate response. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/personas
 * Get list of all available personas
 */
app.get('/api/personas', (req, res) => {
  try {
    const personas = getAllPersonas();
    res.json({
      success: true,
      personas
    });
  } catch (error) {
    console.error('Get Personas Error:', error);
    res.status(500).json({
      error: 'Failed to fetch personas'
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Chatbot server running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set. Please add it to .env file');
  }
});
