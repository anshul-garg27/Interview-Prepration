import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { prisma, redis } from '../index';
import { executeInSandbox } from '../services/codeExecution';
import { generateVisualizationSteps } from '../services/visualization';

const execution = new Hono();

// Validation schemas
const executeCodeSchema = z.object({
  algorithmId: z.string(),
  language: z.enum(['javascript', 'python', 'java', 'cpp']),
  code: z.string(),
  input: z.any()
});

const getExecutionSchema = z.object({
  id: z.string()
});

// POST /api/execution/run - Execute algorithm code
execution.post('/run', zValidator('json', executeCodeSchema), async (c) => {
  const { algorithmId, language, code, input } = c.req.valid('json');
  const userId = c.get('userId'); // From auth middleware
  
  try {
    // Create execution record
    const executionRecord = await prisma.algorithmExecution.create({
      data: {
        userId,
        algorithmId,
        language,
        code,
        input,
        status: 'PENDING'
      }
    });
    
    // Generate execution ID for WebSocket tracking
    const executionId = nanoid();
    
    // Store execution mapping in Redis
    await redis.setex(`execution:${executionId}`, 300, executionRecord.id);
    
    // Execute in background
    executeInSandbox({
      executionId,
      recordId: executionRecord.id,
      language,
      code,
      input,
      userId,
      algorithmId
    }).catch(error => {
      console.error('Background execution failed:', error);
    });
    
    return c.json({
      executionId,
      status: 'PENDING',
      message: 'Code execution started. Connect to WebSocket for real-time updates.'
    });
    
  } catch (error) {
    console.error('Error starting execution:', error);
    return c.json({ error: 'Failed to start execution' }, 500);
  }
});

// GET /api/execution/:id - Get execution result
execution.get('/:id', zValidator('param', getExecutionSchema), async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('userId');
  
  try {
    const executionRecord = await prisma.algorithmExecution.findFirst({
      where: {
        id,
        userId
      },
      include: {
        algorithm: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });
    
    if (!executionRecord) {
      return c.json({ error: 'Execution not found' }, 404);
    }
    
    return c.json({ data: executionRecord });
  } catch (error) {
    console.error('Error fetching execution:', error);
    return c.json({ error: 'Failed to fetch execution' }, 500);
  }
});

// GET /api/execution/history - Get user's execution history
execution.get('/history', async (c) => {
  const userId = c.get('userId');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');
  
  try {
    const [executions, total] = await Promise.all([
      prisma.algorithmExecution.findMany({
        where: { userId },
        include: {
          algorithm: {
            select: {
              name: true,
              slug: true,
              pattern: {
                select: {
                  name: true,
                  topic: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.algorithmExecution.count({ where: { userId } })
    ]);
    
    return c.json({
      data: executions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching execution history:', error);
    return c.json({ error: 'Failed to fetch execution history' }, 500);
  }
});

// POST /api/execution/:id/visualize - Generate visualization for execution
execution.post('/:id/visualize', zValidator('param', getExecutionSchema), async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('userId');
  
  try {
    const executionRecord = await prisma.algorithmExecution.findFirst({
      where: {
        id,
        userId,
        status: 'SUCCESS'
      },
      include: {
        algorithm: true
      }
    });
    
    if (!executionRecord) {
      return c.json({ error: 'Execution not found or not successful' }, 404);
    }
    
    // Generate visualization steps
    const steps = await generateVisualizationSteps(
      executionRecord.algorithm.slug,
      executionRecord.input,
      executionRecord.output
    );
    
    // Update execution with visualization steps
    await prisma.algorithmExecution.update({
      where: { id },
      data: { steps }
    });
    
    return c.json({ data: { steps } });
  } catch (error) {
    console.error('Error generating visualization:', error);
    return c.json({ error: 'Failed to generate visualization' }, 500);
  }
});

// GET /api/execution/stats - Get execution statistics
execution.get('/stats', async (c) => {
  const userId = c.get('userId');
  
  try {
    const stats = await prisma.algorithmExecution.groupBy({
      by: ['status', 'language'],
      where: { userId },
      _count: true,
      _avg: {
        executionTime: true,
        memoryUsage: true
      }
    });
    
    const totalExecutions = await prisma.algorithmExecution.count({
      where: { userId }
    });
    
    const successRate = stats
      .filter(s => s.status === 'SUCCESS')
      .reduce((acc, s) => acc + s._count, 0) / totalExecutions * 100;
    
    return c.json({
      data: {
        totalExecutions,
        successRate: Math.round(successRate * 100) / 100,
        languageStats: stats.reduce((acc, stat) => {
          if (!acc[stat.language]) {
            acc[stat.language] = {
              total: 0,
              success: 0,
              avgExecutionTime: 0,
              avgMemoryUsage: 0
            };
          }
          
          acc[stat.language].total += stat._count;
          if (stat.status === 'SUCCESS') {
            acc[stat.language].success += stat._count;
          }
          
          if (stat._avg.executionTime) {
            acc[stat.language].avgExecutionTime = stat._avg.executionTime;
          }
          
          if (stat._avg.memoryUsage) {
            acc[stat.language].avgMemoryUsage = stat._avg.memoryUsage;
          }
          
          return acc;
        }, {} as Record<string, any>)
      }
    });
  } catch (error) {
    console.error('Error fetching execution stats:', error);
    return c.json({ error: 'Failed to fetch execution stats' }, 500);
  }
});

export { execution as executionRoutes };
