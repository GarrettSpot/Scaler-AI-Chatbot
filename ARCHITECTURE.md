# Architecture & System Design

Complete technical overview of the Persona-Based AI Chatbot.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  │  ChatBox     │  │PersonaSwitcher│  │MessageInput    │ │
│  │  └──────────────┘  └──────────────┘  └────────────────┘ │
│  │         ↓                  ↓                  ↓            │
│  │  ┌──────────────────────────────────────────────────────┐│
│  │  │          chatApi.ts (API Client)                     ││
│  │  │  ├─ sendMessage(message, persona)                   ││
│  │  │  └─ fetchPersonas()                                  ││
│  │  └──────────────────────────────────────────────────────┘│
│  └────────────────────────────────────────────────────────┘  │
│                         ↓                                      │
│                    HTTP/CORS                                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
         ┌───────────────────────────────────┐
         │   Express Backend Server          │
         │   (Node.js, localhost:5000)       │
         ├───────────────────────────────────┤
         │  Routes:                          │
         │  ├─ POST /api/chat                │
         │  ├─ GET  /api/personas            │
         │  └─ GET  /health                  │
         └───────────────────────────────────┘
                   ↓         ↓
        ┌──────────────┐  ┌──────────────┐
        │ personaPrompts│  │  OpenAI API  │
        │  (System      │  │ (gpt-3.5)    │
        │   Prompts)    │  │              │
        └──────────────┘  └──────────────┘
```

## Data Flow

### Message Flow

```
1. User Input
   │
   ├─ Message: "How do I learn DSA?"
   ├─ Persona: "anshumanSingh"
   └─ (Message length: 1-2000 chars)
   
2. Frontend (ChatBox.tsx)
   │
   ├─ Add user message to UI
   ├─ Show typing indicator
   └─ Call chatApi.sendMessage(message, persona)
   
3. Network Request (fetch API)
   │
   ├─ Method: POST
   ├─ URL: http://localhost:5000/api/chat
   ├─ Headers: Content-Type: application/json
   └─ Body: {message, persona}
   
4. Backend Processing (server.js)
   │
   ├─ Validate input (not empty, valid persona)
   ├─ Get system prompt for persona
   │  └─ personaPrompts.getSystemPrompt(persona)
   ├─ Create OpenAI request:
   │  ├─ messages[0].role: "system"
   │  │              content: <system prompt>
   │  └─ messages[1].role: "user"
   │                 content: <user message>
   └─ Call OpenAI API
   
5. LLM Response (OpenAI)
   │
   ├─ Process system prompt + user message
   ├─ Generate contextual response in persona
   └─ Return response text
   
6. Backend Response
   │
   ├─ Extract message from OpenAI response
   ├─ Format response JSON
   └─ Return to frontend
   
7. Frontend Display
   │
   ├─ Remove typing indicator
   ├─ Add assistant message to UI
   ├─ Show persona name and emoji
   └─ Auto-scroll to latest message
```

## Component Architecture

### Frontend Components

```
App.tsx (Entry Point)
  │
  └─ ChatBox.tsx (Main Container)
      ├─ State Management:
      │  ├─ messages: ChatMessage[]
      │  ├─ personas: Persona[]
      │  ├─ activePersona: string
      │  ├─ isLoading: boolean
      │  └─ error: string | null
      │
      ├─ Lifecycle:
      │  ├─ useEffect → fetchPersonas()
      │  ├─ useEffect → auto-scroll on messages
      │  └─ Handlers: handlePersonaChange, handleSendMessage
      │
      ├─ PersonaSwitcher.tsx
      │  ├─ Props: personas, activePersona, onPersonaChange
      │  └─ UI: Tabs for each persona
      │
      ├─ Messages Container
      │  ├─ Empty State (when no messages)
      │  ├─ Message.tsx (for each message)
      │  │  ├─ Props: role, content, persona, emoji
      │  │  └─ UI: Styled message bubble
      │  └─ Typing Indicator (while loading)
      │
      └─ MessageInput.tsx
         ├─ Props: onSend, isLoading
         ├─ State: message text, textarea height
         └─ Features: Enter to send, Shift+Enter for newline
```

### Backend Structure

```
server/
  ├─ server.js (Main entry point)
  │  ├─ Express setup (middleware, CORS)
  │  ├─ Routes:
  │  │  ├─ POST /api/chat
  │  │  │  ├─ Input validation
  │  │  │  ├─ System prompt fetching
  │  │  │  ├─ OpenAI API call
  │  │  │  └─ Error handling
  │  │  ├─ GET /api/personas
  │  │  └─ GET /health
  │  └─ Error middleware
  │
  └─ personaPrompts.js (Persona Data)
     ├─ personas object with 3 personas
     ├─ getSystemPrompt(personaId) function
     └─ getAllPersonas() function
```

## API Specifications

### POST /api/chat

**Purpose:** Get a response from the selected persona

**Request:**
```javascript
{
  message: string,    // 1-2000 chars, required
  persona: string     // anshumanSingh | abhimanyuSaxena | kshitijMishra
}
```

**Response (Success - 200):**
```javascript
{
  success: true,
  message: string,    // Assistant's response
  persona: string     // Selected persona ID
}
```

**Response (Error):**
```javascript
{
  error: string,      // Error message
  details?: string    // Dev mode only
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (empty message, invalid persona)
- `401` - Unauthorized (invalid API key)
- `429` - Rate limited
- `500` - Server error

### GET /api/personas

**Purpose:** Get all available personas

**Response:**
```javascript
{
  success: true,
  personas: [
    {
      id: "anshumanSingh",
      name: "Anshuman Singh",
      emoji: "⚡",
      color: "#FF6B6B"
    },
    // ... 2 more personas
  ]
}
```

### GET /health

**Purpose:** Health check

**Response:**
```javascript
{ status: "ok" }
```

## System Prompt Design

### Prompt Injection Strategy

Each persona's system prompt includes:

```
┌─────────────────────────────────────┐
│ 1. Persona Description              │
│    (Who are you? Background, tone)  │
├─────────────────────────────────────┤
│ 2. Communication Style              │
│    (How do you express yourself?)   │
├─────────────────────────────────────┤
│ 3. Few-shot Examples                │
│    (Example interactions - 3+ pairs)│
├─────────────────────────────────────┤
│ 4. Chain-of-Thought Instruction     │
│    (Think internally, don't expose) │
├─────────────────────────────────────┤
│ 5. Output Format                    │
│    (4-6 sentences, end with Q)      │
├─────────────────────────────────────┤
│ 6. Constraints                      │
│    (What NOT to do)                 │
└─────────────────────────────────────┘
```

**Example Injection:**
```javascript
const systemPrompt = getSystemPrompt('anshumanSingh');

const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: systemPrompt },  // ← Persona injected here
    { role: 'user', content: userMessage }
  ]
});
```

## State Management

### Frontend State

```
ChatBox Component State:
├─ messages: ChatMessage[]
│  └─ { role: 'user'|'assistant', content, persona? }
├─ personas: Persona[]
│  └─ { id, name, emoji, color }
├─ activePersona: string
├─ isLoading: boolean
└─ error: string | null

Message Context:
├─ User messages have role='user'
├─ Assistant messages have role='assistant'
└─ When persona changes:
   ├─ Clear all messages
   ├─ Set new activePersona
   └─ Clear any errors
```

### No Backend State

- Backend is stateless (no conversation history stored)
- Each request is independent
- System prompt is dynamically injected
- If backend restarts, chat continues (frontend manages state)

**Conversation Persistence:**
- Front-end only (session memory)
- Lost on page refresh
- Can be saved to localStorage for persistence

## Error Handling

### Frontend Error Handling

```
User Input
  ↓
Validation: Empty? Invalid?
  ├─ YES → Show error banner, don't send
  └─ NO → Continue
  
Send Request
  ↓
Network Error?
  ├─ YES → Show error, add error message to chat
  └─ NO → Continue

LLM Response Error?
  ├─ YES → Show specific error (API key, rate limit, etc.)
  └─ NO → Display message

User can:
- Close error banner
- Retry message
- Switch persona (clears error)
```

### Backend Error Responses

```
Request Validation:
├─ Empty message → 400 + "Message cannot be empty"
├─ Invalid persona → 400 + "Invalid persona: ..."
└─ Missing fields → 400 + "... must be specified"

API Key Errors:
├─ Missing key → Warning in console, error on first request
├─ Invalid key → 401 + "Invalid API key"
└─ Quota exceeded → 401 + "Rate limit exceeded"

Server Errors:
└─ 500 + Generic error message (dev mode shows details)
```

## Performance Considerations

### Response Time Breakdown

```
User types message
  ↓ (0ms)
Message added to UI (instant)
  ↓ (0ms)
Request sent to backend
  ↓ (10-50ms network)
Backend validates (5ms)
  ↓ (5ms)
Backend calls OpenAI
  ↓ (2000-5000ms LLM processing)
OpenAI returns response
  ↓ (10-50ms network)
Frontend displays message
  ↓ (0ms - instant)
Total: 2-6 seconds average
```

### Optimization Strategies

```
Current:
- Request/response streaming not implemented
- Full response awaited before displaying

Possible Improvements:
├─ Streaming responses (Server Sent Events)
├─ Response caching for common questions
├─ Debounce typing input
├─ Prefetch personas list
├─ Lazy load chat history
├─ Use gpt-3.5-turbo (faster) vs gpt-4 (smarter)
└─ Implement response streaming from OpenAI
```

## Security Architecture

### Secrets Management

```
NOT in code:
❌ API keys hardcoded
❌ Passwords in source
❌ Private data in config

In .env (not committed):
✅ OPENAI_API_KEY
✅ Database credentials (future)
✅ Encryption keys (future)
✅ JWT secrets (future)

In .env.example (committed):
✅ Template variables
✅ Documentation
```

### API Security

```
CORS Configuration:
├─ Only allows frontend domain
├─ Rejects cross-origin requests from other sites
└─ Prevents unauthorized API usage

Input Validation:
├─ Message length limit (2000 chars)
├─ Persona ID must match allowed list
├─ No code execution or SQL injection
└─ Sanitized error messages

Rate Limiting:
├─ OpenAI API has built-in rate limits
├─ Implement per-user limits (future)
└─ Graceful handling of 429 errors
```

## Deployment Architecture

### Local Development

```
http://localhost:3000
    ↓ dev:vite
  Frontend
    ↓ CORS
http://localhost:5000
    ↓ dev:node
  Backend
    ↓ HTTP
OpenAI API
```

### Production

```
example.com (CDN/Vercel)
    ↓
  Frontend (optimized build)
    ↓ HTTPS
api.example.com (Heroku/Render)
    ↓
  Backend
    ↓ HTTPS
OpenAI API
```

## Scalability Considerations

### Current Limits

- 1 Backend instance → ~100 concurrent connections
- 1-2 Frontend instances on CDN → Unlimited
- OpenAI API → Rate limited

### To Scale Up

```
Frontend:
├─ Deploy to CDN (Vercel, Netlify)
├─ Caching layer (Cloudflare)
└─ No changes needed (stateless)

Backend:
├─ Multiple instances with load balancer
├─ Redis for session caching
├─ Database for conversation history
├─ Message queue for async processing
└─ Monitoring and logging (Sentry)

Database:
├─ Conversation history (PostgreSQL)
├─ User profiles (PostgreSQL)
├─ Response cache (Redis)
└─ Analytics (BigQuery)
```

## Monitoring & Logging

### What to Monitor

```
Frontend:
├─ Page load time
├─ Time to first message
├─ Error rates
└─ Browser compatibility

Backend:
├─ Response time
├─ Error rate
├─ API quota usage
├─ CORS errors
└─ Database query time

LLM:
├─ Prompt tokens
├─ Completion tokens
├─ Cost per request
└─ Error rate
```

### Logging Strategy

```
Backend logs:
├─ INFO: Request received
├─ DEBUG: System prompt injected
├─ WARN: Rate limit approaching
└─ ERROR: API call failed

Frontend errors:
├─ Network errors
├─ Rendering errors
└─ API errors
```

---

**This is a production-ready architecture that can scale from single user to thousands of concurrent users with proper infrastructure.**
