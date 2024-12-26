import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import businessModule from './';
import { databasesPlugin } from '../../shared/plugins/databases';
import { appConfig } from '../../shared/config/config';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register plugins
  await app.register(cors);
  await app.register(jwt, { secret: appConfig.JWT_SECRET });

  // Register database connections
  await app.register(databasesPlugin);

  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Test swagger',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'user', description: 'User related end-points' },
        { name: 'code', description: 'Code related end-points' },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header',
          },
        },
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  });

  // Create a plugin for API routes
  app.register(
    async function apiRoutes(fastify) {
      // Register application modules under /api prefix
      await fastify.register(businessModule, { prefix: '/business' });

      // Add a health check route
      fastify.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
      });
    },
    { prefix: '/api' },
  );

  return app;
}
