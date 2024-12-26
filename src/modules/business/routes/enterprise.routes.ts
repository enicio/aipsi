import type { FastifyInstance } from 'fastify';
import { CreateEnterpriseSchema } from '../schemas/enterprise.schema';
import { EnterpriseService } from '../services/enterprise.service';

export async function enterpriseRoutes(fastify: FastifyInstance) {
  const enterpriseService = new EnterpriseService(fastify.postgres);

  fastify.post('/', {
    schema: CreateEnterpriseSchema,
    handler: async (request, reply) => {
      const result = await enterpriseService.create(request.body);
      return reply.code(201).send(result);
    },
  });

  fastify.get('/', {
    handler: async (request, reply) => {
      const enterprises = await enterpriseService.findAll();
      return reply.send(enterprises);
    },
  });

  fastify.get('/:id', {
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const enterprise = await enterpriseService.findById(id);

      if (!enterprise) {
        return reply.code(404).send({ message: 'Enterprise not found' });
      }
      return reply.send(enterprise);
    },
  });
}
