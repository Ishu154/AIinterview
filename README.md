# AI Video Interviewer

A real-time AI-powered interview application that uses OpenAI Whisper for speech-to-text, GPT-4 for intelligent interview question generation, and browser-based text-to-speech for audio responses.

## Features

- 🎤 **Speech Recognition**: Automatic transcription using OpenAI Whisper
- 🤖 **Adaptive Questions**: Dynamic question generation based on candidate responses using GPT-4
- 🔊 **Text-to-Speech**: Browser-based audio output for AI questions
- 📹 **Webcam Integration**: Capture candidate video and audio responses
- 💬 **Live Conversation**: Real-time conversation flow with minimal latency
- 📊 **Session History**: Track the entire interview conversation
- 🎨 **Animated Avatar**: Visual feedback with animated AI avatar

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Web Speech API** - Browser-based text-to-speech
- **MediaRecorder API** - Audio recording

### Backend
- **Node.js + Express** - REST API server
- **Socket.io** - WebSocket support (extensible)
- **OpenAI API** - Whisper (transcription) + GPT-4 (question generation)
- **Multer** - File upload handling

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API Key

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ishu
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Start Interview" to begin
3. On the interview page:
   - The AI interviewer will automatically ask the first question
   - The animated avatar will speak using text-to-speech
   - Click "Start Answer" to record your response
   - Click "Stop & Submit" when done speaking
   - The AI will transcribe your answer and generate the next question
   - Repeat the process

## API Endpoints

### Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/start-interview` | POST | Initialize a new interview session |
| `/api/process-answer` | POST | Process candidate audio, transcribe, and generate next question |

## Project Structure

```
ishu/
├── backend/
│   ├── routes/
│   │   └── api.js           # API route handlers
│   ├── services/
│   │   └── openai.js        # OpenAI integration (Whisper + GPT-4)
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── app/
│   │   ├── interview/
│   │   │   └── page.tsx     # Main interview page
│   │   ├── page.tsx         # Landing page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── AvatarPlayer.tsx # Animated avatar component
│   │   └── WebcamCapture.tsx# Webcam recording component
│   └── package.json
│   └── ...config files
```

## Environment Variables

### Backend (.env)

- `PORT` - Backend server port (default: 5000)
- `OPENAI_API_KEY` - Your OpenAI API key

## Getting API Keys

### OpenAI API Key
1. Sign up at https://platform.openai.com/
2. Navigate to API Keys section
3. Create a new API key
4. Make sure you have credits available

## Troubleshooting

### Common Issues

**Backend Not Starting**
- Ensure all environment variables are set in `.env`
- Check if port 5000 is available
- Run `npm install` to ensure all dependencies are installed

**Frontend Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Ensure Node.js version is 18+

**Text-to-Speech Not Working**
- Ensure you're using a modern browser (Chrome, Edge, Firefox)
- Check browser console for errors
- Some browsers may require HTTPS for Web Speech API
- Try increasing system volume

**Audio Recording Not Working**
- Grant microphone permissions in your browser
- Check if HTTPS is enabled (required for production)
- Try a different browser (Chrome/Edge recommended)

## Development Notes

- The app uses client-side audio recording via MediaRecorder API
- Audio is sent as WebM format to the backend
- The backend uses Multer to handle multipart file uploads
- Interview sessions are stored in-memory (ephemeral)
- For production, implement persistent session storage

## Future Enhancements

- [ ] Add persistent database for session storage
- [ ] Implement user authentication
- [ ] Add interview templates for different roles
- [ ] Export interview transcripts
- [ ] Add performance analytics
- [ ] Support multiple languages
- [ ] Deploy to cloud platform

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

- **HeyGen** - Streaming Avatar Technology
- **OpenAI** - Whisper & GPT-4
- **Next.js** - React Framework
- **Tailwind CSS** - Styling Framework
