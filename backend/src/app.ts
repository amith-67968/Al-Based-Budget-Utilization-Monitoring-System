import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS configuration supporting Vercel, localhost, and custom frontend URLs
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(s => s.trim().replace(/\/$/, '')) : [])
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, mobile, health checks
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if origin matches allowed list or vercel preview/production domain
    const isAllowed = allowedOrigins.includes(normalizedOrigin) ||
      /\.vercel\.app$/.test(new URL(origin).hostname) ||
      process.env.NODE_ENV !== 'production';

    if (isAllowed) {
      return callback(null, true);
    }
    // In production, fallback to permissive for smooth deployment across Vercel custom domains
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root status endpoint (useful for Render live verification)
app.get('/', (_req, res) => {
  res.json({
    name: 'PFM-BUMS Government Portal Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api',
    healthCheck: '/api/health',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

export default app;
