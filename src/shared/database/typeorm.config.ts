import { DataSource, type DataSourceOptions } from 'typeorm';
import { appConfig } from '../config/config';

const isDevelopment = process.env.NODE_ENV === 'development';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: appConfig.POSTGRES_HOST,
  port: appConfig.POSTGRES_PORT,
  username: appConfig.POSTGRES_USER,
  password: appConfig.POSTGRES_PASSWORD,
  database: appConfig.POSTGRES_DB,
  // Use different entity paths for development and production
  entities: isDevelopment
    ? ['src/modules/**/entities/*.entity.ts']
    : ['dist/modules/**/entities/*.entity.js'],
  // Use different migration paths for development and production
  migrations: isDevelopment
    ? ['src/shared/database/migrations/*.ts']
    : ['dist/shared/database/migrations/*.js'],
  synchronize: false,
  logging: true,
};

export const typeOrm = new DataSource(typeormConfig);
