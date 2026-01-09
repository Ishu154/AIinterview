const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { transcribeAudio, generateNextQuestion } = require('../services/gemini');
const { validate, startInterviewSchema, processAnswerSchema } = require('../middleware/validation');
const logger = require('../utils/logger');

// Configure multer for audio file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/ogg'];
        if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith('.webm')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only audio files are allowed.'));
        }
    },
});

// Session storage (in-memory for MVP)
const sessions = {};
// Map<sessionId, { history: [], config: {} }>

/**
 * Start a new interview session
 */
router.post('/start-interview', validate(startInterviewSchema), async (req, res) => {
    try {
        const { role, difficulty, duration } = req.body;

        // Create interview ID
        const interviewId = Date.now().toString();

        // Store session with config
        sessions[interviewId] = {
            history: [],
            config: { role, difficulty, duration },
        };

        // Generate first question
        const firstQuestion = `Hello, I am your AI interviewer. To get started, please tell me a bit about yourself and your background${role ? ` as a ${role}` : ''}.`;

        logger.info('Interview started', { interviewId, role, difficulty });

        res.json({
            interviewId,
            message: 'Interview started',
            firstQuestion,
        });
    } catch (error) {
        logger.error('Failed to start interview', { error: error.message });
        res.status(500).json({ error: 'Failed to start interview' });
    }
});

/**
 * Transcribe audio using Gemini
 */
router.post('/transcribe-audio', upload.single('audio'), async (req, res) => {
    try {
        const { interviewId } = req.body;

        if (!interviewId || !sessions[interviewId]) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        logger.info('Transcribing audio', { interviewId, file: req.file.filename });

        // Transcribe using Gemini
        const transcript = await transcribeAudio(req.file.path);

        logger.info('Transcription complete', { interviewId, transcript });

        res.json({
            transcript,
            confidence: 1.0, // Gemini doesn't provide confidence, but we can assume high quality
        });
    } catch (error) {
        logger.error('Transcription failed', { error: error.message });
        res.status(500).json({ error: 'Transcription failed' });
    }
});

/**
 * Process candidate answer and generate next question
 */
router.post('/process-answer', validate(processAnswerSchema), async (req, res) => {
    const { interviewId, transcript } = req.body;

    if (!interviewId || !sessions[interviewId]) {
        return res.status(404).json({ error: 'Session not found' });
    }

    try {
        logger.info('Processing answer', { interviewId, transcriptLength: transcript.length });

        // Add to history
        sessions[interviewId].history.push({ role: 'user', content: transcript });

        // Generate next question with config
        const nextQuestion = await generateNextQuestion(
            sessions[interviewId].history,
            transcript,
            sessions[interviewId].config
        );

        logger.info('Next question generated', { interviewId });

        sessions[interviewId].history.push({ role: 'assistant', content: nextQuestion });

        // Check if interview is complete
        const isComplete = nextQuestion.toLowerCase().includes('concludes our') ||
            nextQuestion.toLowerCase().includes('thank you for your time');

        res.json({
            transcript,
            nextQuestion,
            isComplete,
        });
    } catch (error) {
        logger.error('Failed to process answer', { error: error.message });
        res.status(500).json({ error: 'Processing failed' });
    }
});

module.exports = router;

