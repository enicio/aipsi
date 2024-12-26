import fp from 'fastify-plugin';
import { enterpriseRoutes } from './routes/enterprise.routes';

export default fp(
  async (fastify) => {
    await fastify.register(enterpriseRoutes, {
      prefix: '/business/enterprises',
    });
  },
  { name: 'business-module', dependencies: ['databases'] },
);
