import { buildApp } from './app';
import { appConfig } from './shared/config/config';

async function start() {
  try {
    const app = await buildApp();

    await app.listen({ host: '0.0.0.0', port: appConfig.PORT });

    app.log.info(`Server listening on port ${appConfig.PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
