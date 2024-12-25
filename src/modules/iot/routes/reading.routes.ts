import type { FastifyInstance } from 'fastify';
import { ReadingService } from '../services/reading.service';
import {
  CreateReadingSchema,
  GetReadingsQuerySchema,
} from '../schemas/reading.schema';
import { Type } from '@sinclair/typebox';

export async function readingRoutes(fastify: FastifyInstance) {
  const readingService = new ReadingService();

  fastify.post('/', {
    schema: CreateReadingSchema,
    handler: async (request, reply) => {
      const reading = await readingService.createReading(request.body);
      return reply.code(201).send(reading);
    },
  });

  fastify.get('/', {
    schema: GetReadingsQuerySchema,
    handler: async (request, reply) => {
      const query = request.query as any;
      if (query.startDate) query.startDate = new Date(query.startDate);
      if (query.endDate) query.endDate = new Date(query.endDate);

      const readings = await readingService.getReadings(query);
      return reply.send(readings);
    },
  });

  fastify.get('/aggregated', {
    schema: {
      querystring: Type.Object({
        deviceId: Type.String(),
        startDate: Type.String({ format: 'date-time' }),
        endDate: Type.String({ format: 'date-time' }),
        interval: Type.Union([
          Type.Literal('hour'),
          Type.Literal('day'),
          Type.Literal('week'),
        ]),
      }),
    },
    handler: async (request, reply) => {
      const query = request.query as any;
      query.startDate = new Date(query.startDate);
      query.endDate = new Date(query.endDate);

      const aggregatedData = await readingService.getAggregatedReadings(query);
      return reply.send(aggregatedData);
    },
  });
}
