import { FastifyInstance } from 'fastify';

export class MqttService {
  constructor(private fastify: FastifyInstance) {}

  async publishMessage(topic: string, message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fastify.mqtt.publish(
        topic,
        JSON.stringify(message),
        { qos: 1 }, // QoS level 1 for at least once delivery
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
      );
    });
  }

  async publishDeviceCommand(
    deviceId: string,
    command: string,
    payload: any,
  ): Promise<void> {
    const topic = `devices/${deviceId}/commands`;
    const message = {
      command,
      payload,
      timestamp: new Date().toISOString(),
    };

    await this.publishMessage(topic, message);
  }
}
