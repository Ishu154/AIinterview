/**
 * Gemini AI Service
 * Handles question generation and audio transcription using Google's Gemini API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Transcribe audio file using Gemini's multimodal capabilities
 * @param {string} audioFilePath - Path to the audio file
 * @returns {Promise<string>} Transcribed text
 */
async function transcribeAudio(audioFilePath) {
    try {
        // Using gemini-2.0-flash which supports audio
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Read audio file
        const audioData = fs.readFileSync(audioFilePath);
        const audioBase64 = audioData.toString('base64');

        // Determine MIME type from file extension
        const ext = path.extname(audioFilePath).toLowerCase();
        let mimeType = 'audio/webm';
        if (ext === '.mp3') mimeType = 'audio/mp3';
        else if (ext === '.wav') mimeType = 'audio/wav';
        else if (ext === '.ogg') mimeType = 'audio/ogg';

        // Create parts for the request
        const parts = [
            {
                inlineData: {
                    mimeType,
                    data: audioBase64,
                },
            },
            { text: 'Transcribe this audio exactly as spoken. Return only the transcription text, nothing else.' },
        ];

        // Generate transcription
        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        // Clean up the audio file
        try {
            fs.unlinkSync(audioFilePath);
        } catch (err) {
            console.error('Failed to delete audio file:', err);
        }

        return text.trim();
    } catch (error) {
        console.error('Error transcribing audio with Gemini:', error);

        // Clean up the audio file even if transcription failed
        try {
            fs.unlinkSync(audioFilePath);
        } catch (err) {
            console.error('Failed to delete audio file:', err);
        }

        throw new Error('Audio transcription failed');
    }
}

/**
 * Generate the next interview question based on conversation history
 * @param {Array} history - Conversation history
 * @param {string} candidateAnswer - Latest answer from candidate
 * @param {Object} config - Interview configuration (role, difficulty)
 * @returns {Promise<string>} Next question
 */
async function generateNextQuestion(history, candidateAnswer, config = {}) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Convert history to readable format
        const conversationHistory = history.map(msg => {
            if (msg.role === 'user') {
                return `Candidate: ${msg.content}`;
            } else {
                return `Interviewer: ${msg.content}`;
            }
        }).join('\n\n');

        // Build prompt based on configuration
        const role = config.role || 'Full Stack Developer';
        const difficulty = config.difficulty || 'Mid Level';

        const prompt = `You are a professional interviewer for a tech company conducting a ${difficulty} level technical interview for a ${role} position.

Your goal is to assess the candidate's technical skills, problem-solving abilities, and knowledge.

Interview Guidelines:
- Ask role-specific technical questions appropriate for ${difficulty} level
- Adapt difficulty based on the candidate's answers (if they struggle, ask simpler follow-ups; if they excel, ask harder ones)
- Ask follow-ups if answers are vague or need clarification
- Keep questions concise (1-2 sentences maximum)
- Never give hints or answers
- Ask one question at a time
- Progress naturally through different technical topics (e.g., fundamentals, architecture, best practices, problem-solving)
- After 8-10 questions, start wrapping up the interview

Previous conversation:
${conversationHistory}

Candidate's latest answer: ${candidateAnswer}

Based on this conversation, generate the NEXT interview question. If you believe the interview has covered sufficient ground (8-10+ questions), you may end with: "That concludes our technical interview. Thank you for your time!"

Return ONLY the question text, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error('Error generating question with Gemini:', error);
        // Fallback to a generic question
        return 'Can you tell me more about your experience with web development technologies?';
    }
}

module.exports = { transcribeAudio, generateNextQuestion };
