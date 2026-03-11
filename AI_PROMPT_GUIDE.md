# 🤖 AI Custom Prompt Configuration Guide

Your AI portfolio assistant is now fully personalized! Here's how to manage and update the prompt that controls how the AI responds as you.

## 📁 Current Setup

**Location:** `backend/ai-system-prompt.txt`

Your custom prompt is stored in a text file that the backend reads on startup. The AI uses this prompt to:
- Respond with your information and personality
- Reference your skills and projects
- Maintain consistency in tone and messaging
- Provide intelligent responses based on your background

## 🔄 How to Update Your Prompt

### Method 1: Direct File Edit (Recommended for local development)

1. Open `backend/ai-system-prompt.txt` in any text editor
2. Replace the entire content with your new prompt
3. Save the file
4. Restart the backend server:
   ```powershell
   # Stop the current server (Ctrl+C in the terminal)
   # Then restart:
   cd backend
   node server.js
   ```

### Method 2: Using the API Endpoint (For future integration)

You can also update the prompt programmatically:

```bash
curl -X POST http://localhost:5000/api/update-prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Your new prompt text here..."}'
```

Response:
```json
{
  "success": true,
  "message": "System prompt updated successfully",
  "prompt": "Your new prompt text here..."
}
```

## ✨ What Your Current Prompt Includes

Your custom prompt tells the AI to:
- ✅ Speak professionally yet approachably
- ✅ Highlight expertise in React, Next.js, Tailwind CSS, etc.
- ✅ Emphasize quality, creativity, and reliability
- ✅ Keep answers concise and jargon-free
- ✅ Use motivational and enthusiastic language
- ✅ Persuade visitors of your skills
- ✅ Make interactions feel personalized

## 📝 Tips for a Great Prompt

1. **Be Specific:** Include exact technologies and skills you use
2. **Set the Tone:** Define how you want to be perceived (e.g., "professional yet approachable")
3. **Include Examples:** Help the AI understand your communication style
4. **Add Rules:** Specify behaviors like "keep answers under 150 words"
5. **Highlight Uniqueness:** Mention what makes you stand out
6. **Update Regularly:** Refresh it as you add new skills or projects

## 🎯 Example Prompt Structure

```
You are [Your Name], a [Your Title]. Your role is to [Primary Purpose].

Key Information:
- Expertise: [Skills 1], [Skills 2], [Skills 3]
- Specialties: [What you're known for]
- Tone: [Desired tone]

Behaviors:
1. [Rule 1]
2. [Rule 2]
3. [Rule 3]

Example Interactions:
- User: "[Sample Question]"
- Bot: "[Desired Response]"
```

## 🔍 How the AI Works

### Demo Mode (Current - Uses at startup)
```
User asks → Pattern matching on keywords → 
Intelligent response generated from your prompt context
```

### Real Mode (When OpenAI is configured)
```
User asks → Custom prompt + Question sent to OpenAI → 
GPT-4o-mini response using your personality/context
```

In demo mode, the AI intelligently extracts information from your prompt (like detecting React, Next.js, E-commerce projects) and generates contextual responses.

## 🚀 Switching to Real OpenAI API

When you're ready to use the full OpenAI API:

1. Ensure you have an active OpenAI API account with available quota
2. Update your API key in `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. Update `backend/.env` to disable demo mode:
   ```
   DEMO_MODE=false
   ```
4. Restart the backend server

Now the AI will use your custom prompt with live OpenAI API responses!

## 📊 Server Status

Check the server status:

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "message": "AI server is running",
  "demoMode": true,
  "promptLoaded": true
}
```

## 🔧 Troubleshooting

**Problem:** Prompt changes not appearing
- **Solution:** Restart the backend server for changes to take effect

**Problem:** AI responses not matching my prompt
- **Solution:** Check that `ai-system-prompt.txt` has the correct content

**Problem:** Server won't start
- **Solution:** Check that `ai-system-prompt.txt` exists and is readable

## 📞 Quick Reference

| Component | Location | Current Status |
|-----------|----------|-----------------|
| Prompt File | `backend/ai-system-prompt.txt` | ✅ Loaded |
| Backend | `http://localhost:5000` | ✅ Running |
| Frontend | `http://localhost:5173` | ✅ Running |
| Demo Mode | Environment Variable | ✅ Enabled |
| OpenAI Key | `backend/.env` | Set but quota exceeded |

---

**Your AI is now responding as you!** The portfolio visitor will have a personalized conversation experience that represents your professional skills and personality. 🎉