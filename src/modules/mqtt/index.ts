import fp from 'fastify-plugin';
import { mqttRoutes } from './routes';

export default fp(
  async (fastify) => {
    await fastify.register(mqttRoutes, { prefix: '/mqtt/devices' });
  },
  {
    name: 'mqtt-module',
    dependencies: ['mqtt'],
  },
);
