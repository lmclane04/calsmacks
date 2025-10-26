// IMPORTANT: Load environment variables FIRST before any route imports
// ES6 imports are hoisted, so we must use require() for routes that depend on env vars
import dotenv from 'dotenv';
import path from 'path';

const dotenvResult = dotenv.config();
console.log('📍 Current working directory:', process.cwd());
console.log('📄 Loading .env from:', path.resolve(process.cwd(), '.env'));
if (dotenvResult.error) {
  console.error('❌ Error loading .env file:', dotenvResult.error);
} else {
  console.log('✅ .env file loaded successfully');
  console.log('🔑 USE_GROQ from .env:', process.env.USE_GROQ);
}

// Now import modules that depend on environment variables
import express from 'express';
import cors from 'cors';
// Use require() for routes to ensure they load AFTER dotenv.config()
const dreamRoutes = require('./routes/dream').default;
const audioRoutes = require('./routes/audio').default;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dream', dreamRoutes);
app.use('/api/audio', audioRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Dream-to-Scene backend running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
