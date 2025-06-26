import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '../index';

const algorithms = new Hono();

// Validation schemas
const getAlgorithmsSchema = z.object({
  topicId: z.string().optional(),
  patternId: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXPERT']).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional()
});

const algorithmIdSchema = z.object({
  id: z.string()
});

// GET /api/algorithms - Get all algorithms with filters
algorithms.get('/', zValidator('query', getAlgorithmsSchema), async (c) => {
  const { topicId, patternId, difficulty, limit = 20, offset = 0 } = c.req.valid('query');
  
  try {
    const where: any = {
      isActive: true
    };
    
    if (topicId) {
      where.pattern = {
        topicId
      };
    }
    
    if (patternId) {
      where.patternId = patternId;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    const [algorithms, total] = await Promise.all([
      prisma.algorithm.findMany({
        where,
        include: {
          pattern: {
            include: {
              topic: true
            }
          }
        },
        orderBy: [
          { pattern: { topic: { order: 'asc' } } },
          { pattern: { order: 'asc' } },
          { order: 'asc' }
        ],
        take: limit,
        skip: offset
      }),
      prisma.algorithm.count({ where })
    ]);
    
    return c.json({
      data: algorithms,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching algorithms:', error);
    return c.json({ error: 'Failed to fetch algorithms' }, 500);
  }
});

// GET /api/algorithms/:id - Get specific algorithm
algorithms.get('/:id', zValidator('param', algorithmIdSchema), async (c) => {
  const { id } = c.req.valid('param');
  
  try {
    const algorithm = await prisma.algorithm.findUnique({
      where: { id },
      include: {
        pattern: {
          include: {
            topic: true
          }
        }
      }
    });
    
    if (!algorithm) {
      return c.json({ error: 'Algorithm not found' }, 404);
    }
    
    return c.json({ data: algorithm });
  } catch (error) {
    console.error('Error fetching algorithm:', error);
    return c.json({ error: 'Failed to fetch algorithm' }, 500);
  }
});

// GET /api/algorithms/:id/similar - Get similar algorithms
algorithms.get('/:id/similar', zValidator('param', algorithmIdSchema), async (c) => {
  const { id } = c.req.valid('param');
  
  try {
    const algorithm = await prisma.algorithm.findUnique({
      where: { id },
      select: { patternId: true, difficulty: true, tags: true }
    });
    
    if (!algorithm) {
      return c.json({ error: 'Algorithm not found' }, 404);
    }
    
    const similar = await prisma.algorithm.findMany({
      where: {
        id: { not: id },
        OR: [
          { patternId: algorithm.patternId },
          { difficulty: algorithm.difficulty },
          { tags: { hasSome: algorithm.tags } }
        ],
        isActive: true
      },
      include: {
        pattern: {
          include: {
            topic: true
          }
        }
      },
      take: 5,
      orderBy: { order: 'asc' }
    });
    
    return c.json({ data: similar });
  } catch (error) {
    console.error('Error fetching similar algorithms:', error);
    return c.json({ error: 'Failed to fetch similar algorithms' }, 500);
  }
});

// GET /api/algorithms/topics - Get all topics with patterns
algorithms.get('/topics', async (c) => {
  try {
    const topics = await prisma.topic.findMany({
      where: { isActive: true },
      include: {
        patterns: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                algorithms: {
                  where: { isActive: true }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    return c.json({ data: topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return c.json({ error: 'Failed to fetch topics' }, 500);
  }
});

// GET /api/algorithms/patterns/:patternId - Get algorithms by pattern
algorithms.get('/patterns/:patternId', async (c) => {
  const patternId = c.req.param('patternId');
  
  try {
    const pattern = await prisma.pattern.findUnique({
      where: { id: patternId },
      include: {
        topic: true,
        algorithms: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!pattern) {
      return c.json({ error: 'Pattern not found' }, 404);
    }
    
    return c.json({ data: pattern });
  } catch (error) {
    console.error('Error fetching pattern algorithms:', error);
    return c.json({ error: 'Failed to fetch pattern algorithms' }, 500);
  }
});

export { algorithms as algorithmRoutes };
