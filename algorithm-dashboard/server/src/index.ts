import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { serve } from '@hono/node-server';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import pino from 'pino';

import { algorithmRoutes } from './routes/algorithms';
import { executionRoutes } from './routes/execution';
import { visualizationRoutes } from './routes/visualization';
import { authRoutes } from './routes/auth';
import { progressRoutes } from './routes/progress';
import { websocketHandler } from './websockets/handler';
import { rateLimiter } from './middleware/rateLimit';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Initialize services
const app = new Hono();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const log = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

// Global middleware
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use('*', secureHeaders());
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', rateLimiter);

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      redis: 'connected',
      websocket: 'active'
    }
  });
});

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/algorithms', algorithmRoutes);
app.route('/api/execution', executionRoutes);
app.route('/api/visualization', visualizationRoutes);
app.route('/api/progress', progressRoutes);

// Error handling
app.use('*', errorHandler);

// Server setup
const port = parseInt(process.env.PORT || '3001');
const server = createServer();

// WebSocket setup
const wss = new WebSocketServer({ server });
websocketHandler(wss, redis, log);

// Start server
server.on('request', app.fetch);

server.listen(port, () => {
  log.info(`🚀 Algorithm Dashboard Backend running on port ${port}`);
  log.info(`📊 WebSocket server active for real-time visualization`);
  log.info(`🗄️  Database: Connected to PostgreSQL`);
  log.info(`⚡ Cache: Connected to Redis`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  log.info('Shutting down gracefully...');
  await prisma.$disconnect();
  redis.disconnect();
  server.close();
});

export { prisma, redis, log };
