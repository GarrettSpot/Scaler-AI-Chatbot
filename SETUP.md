# Setup & Run Instructions

Complete guide to run the Persona-Based AI Chatbot locally.

## Prerequisites

Make sure you have installed:

- **Node.js** v16+ → Download from https://nodejs.org/
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning)
- **OpenAI API Key** → Get from https://platform.openai.com/api-keys

## Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Keep it safe!** Never share or commit this to Git

## Step 2: Setup Backend

### Install Dependencies

```bash
cd server
npm install
```

This installs:
- **express** - Web server
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **openai** - OpenAI API client

### Configure Environment

Create/update `server/.env`:

```bash
OPENAI_API_KEY=sk-your-key-here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Replace `sk-your-key-here` with your actual OpenAI API key.

### Start Backend

```bash
npm run dev
```

Expected output:
```
🚀 Chatbot server running on http://localhost:5000
```

**Leave this terminal running!**

## Step 3: Setup Frontend

### In a NEW terminal:

```bash
cd client
npm install
```

### Configure Environment

Create/update `client/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

### Start Frontend

```bash
npm run dev
```

Expected output:
```
  VITE v X.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

## Step 4: Open in Browser

Navigate to: **http://localhost:5173**

You should see:
- 🤖 **Persona Mentor Chatbot** header
- 3 persona tabs (⚡ Anshuman, 🤝 Abhimanyu, 📚 Kshitij)
- Empty chat area
- Message input box

## Step 5: Test the Chatbot

1. **Select a Persona** - Click one of the three tabs
2. **Type a Message** - E.g., "How do I learn DSA?"
3. **Send** - Hit Enter or click Send button
4. **Wait for Response** - See typing indicator, then message
5. **Switch Persona** - Try another mentor for different perspective

Example prompts to try:
- "I feel stuck in my coding journey"
- "Should I focus on DSA or web development?"
- "How do I stay motivated?"
- "What's your approach to teaching?"

## Troubleshooting

### Backend won't start

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:** Port 5000 is already in use.
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=5001
```

**Error:** `OPENAI_API_KEY not set`

**Solution:** Add your API key to `server/.env`
```bash
OPENAI_API_KEY=sk-your-actual-key
```

### Frontend can't connect

**Error:** Blank screen, message won't send

**Solution:** 
1. Check backend is running (terminal shows port 5000)
2. Verify `client/.env` has `VITE_API_URL=http://localhost:5000`
3. Open browser DevTools (F12) → Console → check for errors
4. Reload page (Ctrl+R)

### API key errors

**Error:** `401 Unauthorized`

**Solution:** 
1. Double-check API key in `server/.env` (starts with `sk-`)
2. Verify key is active at https://platform.openai.com/api-keys
3. Check you have usage quota (API has rate limits)
4. Try generating a new key

### Persona not switching

**Error:** Messages stuck with same persona

**Solution:** 
1. Refresh page (Ctrl+R)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try different browser
4. Check browser console for errors (F12)

## Development Tips

### Hot Reload

Both backend and frontend support auto-reload:

**Backend:** `npm run dev` watches files, auto-restarts
**Frontend:** `npm run dev` watches files, auto-refreshes browser

Just save your code, no need to restart!

### Debug Mode

Open browser DevTools (F12):
- **Console** - Errors and logs
- **Network** - API requests/responses
- **Application** → Local Storage - Session data

### Test API Directly

Use curl or Postman to test backend:

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","persona":"anshumanSingh"}'
```

Or use Postman:
1. Method: **POST**
2. URL: **http://localhost:5000/api/chat**
3. Body (raw JSON):
```json
{
  "message": "How do I improve at coding?",
  "persona": "anshumanSingh"
}
```

## Next Steps

### For Learning

- Read [README.md](README.md) for full documentation
- Check [prompts.md](prompts.md) to see system prompts
- Explore code in `server/src/` and `client/src/`

### For Deployment

- Deploy backend to Heroku, Railway, or Render
- Deploy frontend to Vercel or Netlify
- See [README.md](README.md) deployment section

### For Customization

- Add new personas in `server/src/personaPrompts.js`
- Modify UI in `client/src/components/`
- Change styling in `.css` files
- Adjust LLM settings in `server/src/server.js`

## Performance Optimization

- **Backend:** Responses take 2-5 seconds (LLM processing time)
- **Frontend:** Instant UI response with typing indicator
- **Network:** Optimized for 4G/WiFi

For production:
- Use GPT-4 for better quality (slower, more expensive)
- Add response streaming for perceived speed
- Cache common questions
- Implement Redis for sessions

## Production Checklist

Before deploying:
- ✅ API key secured (env variables, not hardcoded)
- ✅ CORS configured for production domain
- ✅ Error handling is graceful
- ✅ Frontend build optimized (`npm run build`)
- ✅ Backend logging configured
- ✅ Rate limiting implemented
- ✅ HTTPS enabled
- ✅ Database backup strategy

## Support

If stuck:

1. **Check error messages** - Look at terminal/console output
2. **Review README.md** - Main documentation
3. **Check prompts.md** - System prompt details
4. **Search GitHub Issues** - Similar problems
5. **Test API directly** - Isolate frontend vs backend issues

---

**Ready to chat?** Open http://localhost:5173 and start talking to the mentors! 🚀
