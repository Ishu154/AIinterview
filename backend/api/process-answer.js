/**
 * Vercel Serverless Function: Process Answer
 * Generates next interview question using Gemini AI
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
        const { interviewId, transcript, history = [], config = {} } = req.body || {};

        if (!interviewId) {
            return res.status(400).json({ error: 'Interview ID required' });
        }

        if (!transcript) {
            return res.status(400).json({ error: 'Transcript required' });
        }

        console.log('Processing answer:', { interviewId, transcriptLength: transcript.length });

        // Generate next question using Gemini
        const nextQuestion = await generateNextQuestion(history, transcript, config);

        // Check if interview is complete
        const isComplete = nextQuestion.toLowerCase().includes('concludes our') ||
            nextQuestion.toLowerCase().includes('thank you for your time');

        res.status(200).json({
            transcript,
            nextQuestion,
            isComplete,
        });
    } catch (error) {
        console.error('Failed to process answer:', error);
        res.status(500).json({ error: 'Processing failed' });
    }
};

/**
 * Generate next interview question using Gemini
 */
async function generateNextQuestion(history, candidateAnswer, config = {}) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Convert history to readable format
        const conversationHistory = (history || []).map(msg => {
            if (msg.role === 'user' || msg.speaker === 'You') {
                return `Candidate: ${msg.content || msg.text}`;
            } else {
                return `Interviewer: ${msg.content || msg.text}`;
            }
        }).join('\n\n');

        const role = config.role || 'Full Stack Developer';
        const difficulty = config.difficulty || 'Mid Level';

        const prompt = `You are a professional interviewer conducting a ${difficulty} level technical interview for a ${role} position.

Interview Guidelines:
- Ask role-specific technical questions appropriate for ${difficulty} level
- Adapt difficulty based on the candidate's answers
- Ask follow-ups if answers are vague
- Keep questions concise (1-2 sentences maximum)
- Never give hints or answers
- Ask one question at a time
- After 8-10 questions, wrap up with: "That concludes our technical interview. Thank you for your time!"

Previous conversation:
${conversationHistory}

Candidate's latest answer: ${candidateAnswer}

Generate the NEXT interview question. Return ONLY the question text, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error('Error generating question with Gemini:', error);
        return 'Can you tell me more about your experience with web development technologies?';
    }
}
