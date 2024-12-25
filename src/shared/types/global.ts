import type mongoose from 'mongoose';
import type * as mqtt from 'mqtt';
import type { DataSource } from 'typeorm';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: typeof mongoose;
    postgres: DataSource;
    // @ts-ignore
    mqtt: mqtt.Client;
  }
}
