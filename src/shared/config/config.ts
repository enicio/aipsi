import { config } from 'dotenv';
import { Type, type Static } from '@sinclair/typebox';

config();

const ConfigSchema = Type.Object({
  PORT: Type.Number({ default: 3000 }),
  MONGO_URI: Type.String(),
  POSTGRES_HOST: Type.String(),
  POSTGRES_PORT: Type.Number({ default: 5432 }),
  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_DB: Type.String(),
  JWT_SECRET: Type.String(),
});

type ConfigType = Static<typeof ConfigSchema>;

export const appConfig: ConfigType = {
  PORT: Number.parseInt(process.env.PORT || '3000'),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/iot_data',
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: Number.parseInt(process.env.POSTGRES_PORT || '5432'),
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
  POSTGRES_DB: process.env.POSTGRES_DB || 'iot_business',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
};
