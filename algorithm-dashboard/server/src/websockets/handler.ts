import { WebSocketServer, WebSocket } from 'ws';
import { Redis } from 'ioredis';
import { Logger } from 'pino';
import { nanoid } from 'nanoid';

interface WebSocketClient {
  id: string;
  ws: WebSocket;
  userId?: string;
  executionId?: string;
}

interface VisualizationMessage {
  type: 'execution_started' | 'step' | 'execution_completed' | 'execution_error';
  executionId: string;
  data: any;
  timestamp: number;
}

const clients = new Map<string, WebSocketClient>();

export function websocketHandler(wss: WebSocketServer, redis: Redis, log: Logger) {
  wss.on('connection', (ws, request) => {
    const clientId = nanoid();
    const client: WebSocketClient = {
      id: clientId,
      ws
    };
    
    clients.set(clientId, client);
    log.info(`WebSocket client connected: ${clientId}`);
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      clientId,
      timestamp: Date.now()
    }));
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        await handleMessage(client, message, redis, log);
      } catch (error) {
        log.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });
    
    ws.on('close', () => {
      clients.delete(clientId);
      log.info(`WebSocket client disconnected: ${clientId}`);
    });
    
    ws.on('error', (error) => {
      log.error(`WebSocket error for client ${clientId}:`, error);
      clients.delete(clientId);
    });
  });
  
  // Subscribe to Redis channels for execution updates
  redis.subscribe('execution:updates', 'visualization:steps');
  
  redis.on('message', (channel, message) => {
    try {
      const data = JSON.parse(message);
      
      if (channel === 'execution:updates') {
        broadcastExecutionUpdate(data);
      } else if (channel === 'visualization:steps') {
        broadcastVisualizationStep(data);
      }
    } catch (error) {
      log.error('Error processing Redis message:', error);
    }
  });
}

async function handleMessage(
  client: WebSocketClient,
  message: any,
  redis: Redis,
  log: Logger
) {
  switch (message.type) {
    case 'authenticate':
      client.userId = message.userId;
      client.ws.send(JSON.stringify({
        type: 'authenticated',
        userId: message.userId
      }));
      break;
      
    case 'subscribe_execution':
      client.executionId = message.executionId;
      
      // Send current execution status if available
      const status = await redis.get(`execution:status:${message.executionId}`);
      if (status) {
        client.ws.send(JSON.stringify({
          type: 'execution_status',
          executionId: message.executionId,
          data: JSON.parse(status)
        }));
      }
      break;
      
    case 'unsubscribe_execution':
      client.executionId = undefined;
      break;
      
    case 'ping':
      client.ws.send(JSON.stringify({
        type: 'pong',
        timestamp: Date.now()
      }));
      break;
      
    default:
      log.warn(`Unknown message type: ${message.type}`);
  }
}

function broadcastExecutionUpdate(data: any) {
  const message: VisualizationMessage = {
    type: data.type,
    executionId: data.executionId,
    data: data.payload,
    timestamp: Date.now()
  };
  
  // Send to clients subscribed to this execution
  for (const client of clients.values()) {
    if (client.executionId === data.executionId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }
}

function broadcastVisualizationStep(data: any) {
  const message: VisualizationMessage = {
    type: 'step',
    executionId: data.executionId,
    data: data.step,
    timestamp: Date.now()
  };
  
  // Send to clients subscribed to this execution
  for (const client of clients.values()) {
    if (client.executionId === data.executionId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }
}

// Utility functions for other services to broadcast updates
export async function broadcastExecutionStarted(executionId: string, data: any, redis: Redis) {
  await redis.publish('execution:updates', JSON.stringify({
    type: 'execution_started',
    executionId,
    payload: data
  }));
}

export async function broadcastExecutionCompleted(executionId: string, data: any, redis: Redis) {
  await redis.publish('execution:updates', JSON.stringify({
    type: 'execution_completed',
    executionId,
    payload: data
  }));
}

export async function broadcastExecutionError(executionId: string, error: any, redis: Redis) {
  await redis.publish('execution:updates', JSON.stringify({
    type: 'execution_error',
    executionId,
    payload: { error }
  }));
}

export async function broadcastVisualizationStep(executionId: string, step: any, redis: Redis) {
  await redis.publish('visualization:steps', JSON.stringify({
    executionId,
    step
  }));
}
