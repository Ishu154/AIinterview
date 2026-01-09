# Quick Start Guide

## Prerequisites Checklist

Before running the application, make sure you have:

- [ ] Node.js 18+ installed
- [ ] OpenAI API Key (from https://platform.openai.com)

## Environment Setup

1. **Configure Backend Environment**

   Edit `backend/.env`:
   ```env
   PORT=5000
   OPENAI_API_KEY=your_openai_key_here
   ```

## Running the Application

### Option 1: Automated Start (Windows)

Double-click `start.bat` - this will:
- Install dependencies if needed
- Start both servers automatically
- Open separate windows for backend and frontend

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Access the Application

Open your browser and navigate to:
- **Application**: http://localhost:3000
- **Backend API**: http://localhost:5000

## First Time Setup

1. Click "Start Interview" on the home page
2. Allow camera and microphone permissions when prompted
3. The AI will automatically ask the first question using text-to-speech
4. Listen to the AI's question
5. Click "Start Answer" to record your response
6. Click "Stop & Submit" when done

## Troubleshooting

### Backend won't start
- Check if `.env` file exists with valid API keys
- Verify port 5000 is not in use
- Run `npm install` in backend directory

### Frontend won't start
- Clear Next.js cache: `rm -rf frontend/.next`
- Run `npm install` in frontend directory
- Check if port 3000 is available

### Text-to-Speech not working
- Ensure using a modern browser (Chrome/Edge recommended)
- Check browser console for errors
- Try increasing system volume
- Some browsers may require HTTPS

### Microphone not working
- Grant browser permissions for microphone
- Test in Chrome/Edge (best compatibility)
- Check system microphone settings

## API Keys

### Get OpenAI API Key
1. Visit https://platform.openai.com
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy and paste into `.env`

## Next Steps

- Read the full [README.md](README.md) for detailed information
- Check API documentation for customization
- Explore the code to understand the architecture

## Support

If you encounter issues:
1. Check the console logs (backend and browser)
2. Verify all environment variables are set
3. Ensure API keys have sufficient credits/quota
4. Review the troubleshooting section above
