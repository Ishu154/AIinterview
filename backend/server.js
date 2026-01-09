const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for MVP
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Basic health check
app.get('/', (req, res) => {
    res.send('AI Interviewer Backend is running');
});

// Import routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

// Socket.io connection
io.on('connection', (socket) => {
    logger.info('Client connected', { socketId: socket.id });

    socket.on('disconnect', () => {
        logger.info('Client disconnected', { socketId: socket.id });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
    });
});

