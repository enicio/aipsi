import mongoose from 'mongoose';
import { DataSource } from 'typeorm';

declare module 'fastify' {
    interface FastifyInstance {
      mongo: typeof mongoose;
      postgres: DataSource;
    }
  }