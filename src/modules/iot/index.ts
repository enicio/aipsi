import fp from 'fastify-plugin';
import { readingRoutes } from './routes/reading.routes';

export default fp(
  async (fastify) => {
    await fastify.register(readingRoutes, { prefix: '/iot/readings' });
  },
  { name: 'iot-module', dependencies: ['databases'] },
);
