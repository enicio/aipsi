import fp from 'fastify-plugin';
import * as mqtt from 'mqtt';
import { ReadingService } from '../iot/services/reading.service';
import type { FastifyInstance } from 'fastify';

interface MqttPluginOptions {
  url: string;
  topics: string[];
}

export const mqttPlugin = fp(
  async (fastify: FastifyInstance, options: MqttPluginOptions) => {
    const { url, topics } = options;
    const readingService = new ReadingService();

    // Create MQTT client
    const client = mqtt.connect(url);

    // Handle connection
    client.on('connect', () => {
      fastify.log.info('Connected to MQTT broker');

      // Subscribe to topics
      topics.forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (err) {
            fastify.log.error(`Error subscribing to ${topic}:`, err);
          } else {
            fastify.log.info(`Subscribed to ${topic}`);
          }
        });
      });
    });

    // Handle messages
    client.on('message', async (topic: string, payload: Buffer) => {
      try {
        const message = JSON.parse(payload.toString());
        console.log(message);
        fastify.log.info(`Received message on ${topic}:`, message);

        // Process message based on topic
        switch (topic) {
          case 'devices/readings':
            await readingService.createReading({
              deviceId: message.deviceId,
              enterpriseId: message.enterpriseId,
              readings: message.readings,
              timestamp: new Date(message.timestamp || Date.now()),
              metadata: message.metadata,
            });
            break;

          // Add more topic handlers as needed
          default:
            fastify.log.warn(`No handler for topic: ${topic}`);
        }
      } catch (error) {
        fastify.log.error('Error processing MQTT message:', error);
      }
    });

    // Handle errors
    client.on('error', (error) => {
      fastify.log.error('MQTT error:', error);
    });

    // Decorate fastify instance with mqtt client
    fastify.decorate('mqtt', client);

    // Clean up on server close
    fastify.addHook('onClose', (instance, done) => {
      instance.mqtt.end(false, {}, () => {
        fastify.log.info('MQTT client closed');
        done();
      });
    });
  },
  {
    name: 'mqtt',
    dependencies: ['databases'],
  },
);
