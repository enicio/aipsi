import { FastifyInstance } from 'fastify';
import { EnterpriseRepository } from '../repositories/enterprise.repository';
import { CreateEnterpriseSchema } from '../schemas/enterprise.schema';

export async function enterpriseRoutes(fastify: FastifyInstance) {
  const repository = fastify.postgres.getRepository(EnterpriseRepository);

  fastify.post('/', {
    schema: CreateEnterpriseSchema,
    handler: async (request, reply) => {
      const enterprise = repository.create(request.body);
      const result = await repository.save(enterprise);
      return reply.code(201).send(result);
    },
  });

  fastify.get('/', {
    handler: async (request, reply) => {
      const enterprises = await repository.find();
      return reply.send(enterprises);
    },
  });

  fastify.get('/:id', {
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const enterprise = await repository.findWithEmployeesAndDevices(id);
      if (!enterprise) {
        return reply.code(404).send({ message: 'Enterprise not found' });
      }
      return reply.send(enterprise);
    },
  });
}
