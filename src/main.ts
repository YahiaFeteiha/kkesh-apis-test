import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/storage',
  });
  app.useStaticAssets(join(__dirname, '..', 'videos'), {
    prefix: '/video',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
