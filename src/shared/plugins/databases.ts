import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { DataSource } from 'typeorm';
import { appConfig } from '../config/config';

export const databasesPlugin = fp(
  async (fastify) => {
    // MongoDB Connection
    const mongoConnection = await mongoose.connect(appConfig.MONGO_URI);

    // PostgreSQL Connection
    const postgresConnection = new DataSource({
      type: 'postgres',
      host: appConfig.POSTGRES_HOST,
      port: appConfig.POSTGRES_PORT,
      username: appConfig.POSTGRES_USER,
      password: appConfig.POSTGRES_PASSWORD,
      database: appConfig.POSTGRES_DB,
      synchronize: true, // Be careful with this in production
      entities: ['src/modules/**/entities/*.entity.ts'],
    });

    await postgresConnection.initialize();

    // Decorate Fastify instance with our database connections
    fastify.decorate('mongo', mongoConnection);
    fastify.decorate('postgres', postgresConnection);

    // Handle cleanup on close
    fastify.addHook('onClose', async (instance) => {
      await instance.mongo.connection.close();
      await instance.postgres.destroy();
    });
  },
  {
    name: 'databases', // This is important! This matches the dependency name
  },
);
