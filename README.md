# Persona-Based AI Chatbot

A production-ready AI chatbot with 3 distinct personas, built with React + Node.js + OpenAI API.

## Features

✨ **3 Unique Personas**
- **Anshuman Singh** (⚡) - Candid, sharp, practical mentor
- **Abhimanyu Saxena** (🤝) - Thoughtful leader and educator
- **Kshitij Mishra** (📚) - Helpful and diplomatic mentor

🎨 **Modern UI**
- Clean, responsive chat interface
- Real-time typing indicators
- Smooth message animations
- Mobile-friendly design

⚙️ **Production Ready**
- Persona system prompt injection
- Error handling & graceful fallbacks
- Rate limiting support
- CORS enabled

## Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **OpenAI API Key** (get from https://platform.openai.com/api-keys)

## Quick Start

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Setup Environment Variables

**Backend** (`server/.env`):
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend** - Create `client/.env`:
```bash
VITE_API_URL=http://localhost:5000
```

### 3. Start Backend Server

```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

### 4. Start Frontend (in new terminal)

```bash
cd client
npm run dev
# Frontend running on http://localhost:5173
```

### 5. Open in Browser

Navigate to **http://localhost:5173**

## Project Structure

```
Scaler-AI-Chatbot/
├── server/
│   ├── src/
│   │   ├── server.js           # Express server & routes
│   │   └── personaPrompts.js   # System prompts for each persona
│   ├── package.json
│   ├── .env                    # Environment variables (ADD YOUR API KEY)
│   └── .env.example            # Example env file
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.tsx      # Main chat container
│   │   │   ├── Message.tsx      # Individual message display
│   │   │   ├── MessageInput.tsx # Message input with send
│   │   │   ├── PersonaSwitcher.tsx # Persona tabs
│   │   │   └── *.css           # Component styles
│   │   ├── services/
│   │   │   └── chatApi.ts       # API communication
│   │   ├── App.tsx             # App entry
│   │   ├── main.tsx
│   │   └── *.css               # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── prompts.md                  # Detailed system prompts documentation
```

## How It Works

### Backend Flow

1. **Request** → User sends message + persona ID to `/api/chat`
2. **System Prompt Injection** → Backend fetches persona's system prompt
3. **LLM Call** → System prompt + user message sent to OpenAI
4. **Response** → Assistant's response returned to frontend

### Frontend Flow

1. **Persona Selection** → User clicks persona tab
2. **Conversation Reset** → Previous messages cleared
3. **Message Send** → User message added to UI + sent to backend
4. **Response Display** → Assistant response shown with typing indicator
5. **Context Maintained** → Current persona's system prompt used for all messages

## API Endpoints

### POST `/api/chat`
Send a message and get persona response.

**Request:**
```json
{
  "message": "How do I improve at coding?",
  "persona": "anshumanSingh"
}
```

**Response:**
```json
{
  "success": true,
  "message": "The assistant's response...",
  "persona": "anshumanSingh"
}
```

**Error Response:**
```json
{
  "error": "Invalid API key"
}
```

### GET `/api/personas`
Get list of all available personas.

**Response:**
```json
{
  "success": true,
  "personas": [
    {
      "id": "anshumanSingh",
      "name": "Anshuman Singh",
      "emoji": "⚡",
      "color": "#FF6B6B"
    },
    ...
  ]
}
```

### GET `/health`
Health check endpoint.

## System Prompts

Each persona has a detailed system prompt that includes:

- **Persona Description** - Background, tone, values
- **Communication Style** - How they respond
- **Few-shot Examples** - 3-5 example interactions
- **Chain-of-Thought Instructions** - Reason internally, don't expose reasoning
- **Output Format** - Response structure (4-6 sentences, ends with question)
- **Constraints** - What NOT to do

See [prompts.md](prompts.md) for full prompt details.

## Error Handling

The app handles:

- **Empty messages** → Validation error
- **Invalid persona** → 400 Bad Request
- **API key missing/invalid** → 401 Unauthorized
- **Rate limits** → 429 Too Many Requests
- **Network errors** → Graceful error banner
- **Persona switch** → Conversation reset for clarity

## Configuration

### Changing Model

In `server/src/server.js`, line with `model`:
```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',  // Change to 'gpt-4', 'gpt-4-turbo', etc.
  ...
});
```

### Adjusting Response Length

In `server/src/server.js`:
```javascript
max_tokens: 500,  // Adjust response length (max 2048)
temperature: 0.7, // Adjust creativity (0-1, higher = more creative)
top_p: 0.9,       // Adjust diversity (0-1)
```

### Custom Personas

Add new persona to `server/src/personaPrompts.js`:
```javascript
customMentor: {
  name: 'Custom Name',
  systemPrompt: `Your persona instructions...`,
  color: '#1ABC9C',
  emoji: '🎯'
}
```

## Deployment

### Frontend (Vercel)

```bash
cd client
npm run build
# Deploy the 'dist' folder to Vercel
```

### Backend (Heroku/Railway/Render)

1. Push code to GitHub
2. Connect repository
3. Set environment variables (OPENAI_API_KEY, CLIENT_URL)
4. Deploy

### Update Frontend API URL

Change `VITE_API_URL` in deployed backend's URL.

## Development

### Local Development with Hot Reload

```bash
# Backend - auto-restarts on file changes
npm run dev

# Frontend - auto-refreshes on code changes
npm run dev
```

### Building for Production

```bash
# Backend - no build needed (Node.js)

# Frontend
cd client
npm run build
# Creates 'dist' folder with optimized build
```

## Troubleshooting

### "Invalid API key" error
- Verify OPENAI_API_KEY in server/.env
- Check API key is valid at https://platform.openai.com/api-keys
- Ensure key has sufficient quota

### Frontend can't connect to backend
- Check backend is running on http://localhost:5000
- Verify CORS_URL in server/.env
- Check VITE_API_URL in client/.env

### Messages not sending
- Check browser console for errors
- Verify OpenAI API key is valid
- Check rate limits (429 errors)

### Persona not switching
- Refresh the page
- Clear browser cache
- Check persona IDs are correct

## Performance Tips

- **Optimize images** in public folder
- **Enable gzip** on backend
- **Use CDN** for static assets
- **Implement caching** for personas list
- **Add streaming** for long responses

## Security Considerations

✅ **Done:**
- API key in .env (not hardcoded)
- CORS configured
- Input validation
- Error message sanitization

⚠️ **TODO (for production):**
- Add authentication (JWT)
- Implement rate limiting per user
- Add conversation encryption
- Log all interactions
- Add HTTPS requirement

## License

MIT

## Support

For issues or questions, check:
1. [prompts.md](prompts.md) - System prompt details
2. API logs in terminal
3. Browser console errors
4. Backend server console

---

Built with ❤️ using React, Node.js, and OpenAI API
