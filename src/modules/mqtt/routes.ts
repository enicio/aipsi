import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { MqttService } from './service';

export async function mqttRoutes(fastify: FastifyInstance) {
  const mqttService = new MqttService(fastify);

  fastify.post('/publish', {
    schema: {
      body: Type.Object({
        topic: Type.String(),
        message: Type.Any(),
      }),
    },
    handler: async (request, reply) => {
      const { topic, message } = request.body as any;
      await mqttService.publishMessage(topic, message);
      return { success: true };
    },
  });

  fastify.post('/devices/:deviceId/command', {
    schema: {
      params: Type.Object({
        deviceId: Type.String(),
      }),
      body: Type.Object({
        command: Type.String(),
        payload: Type.Any(),
      }),
    },
    handler: async (request, reply) => {
      const { deviceId } = request.params as any;
      const { command, payload } = request.body as any;
      await mqttService.publishDeviceCommand(deviceId, command, payload);
      return { success: true };
    },
  });
}
