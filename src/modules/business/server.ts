import 'reflect-metadata';
import { buildApp } from './app';
// import { appConfig } from '@/shared/config/config';

async function start() {
  try {
    const app = await buildApp();

    await app.listen({ host: '0.0.0.0', port: 3333 });

    app.log.info('Server listening on port 3333');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
