/**
 * Vercel Serverless Function: Start Interview
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// In-memory session storage (Note: Vercel serverless is stateless, so we use simple approach)
// For production, use a database like Vercel KV or Upstash Redis

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { role, difficulty, duration } = req.body || {};

        // Create interview ID
        const interviewId = Date.now().toString();

        // Generate first question
        const firstQuestion = `Hello! I'm your AI interviewer today. I'll be conducting a ${difficulty || 'Mid Level'} technical interview for the ${role || 'Full Stack Developer'} position. Let's start with an introduction - could you tell me about yourself and your background in software development?`;

        console.log('Interview started:', { interviewId, role, difficulty });

        res.status(200).json({
            interviewId,
            message: 'Interview started',
            firstQuestion,
        });
    } catch (error) {
        console.error('Failed to start interview:', error);
        res.status(500).json({ error: 'Failed to start interview' });
    }
};
