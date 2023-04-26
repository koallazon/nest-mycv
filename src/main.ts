import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// import { CookieSession } from 'cookie-session';
// import * as cookieSession from 'cookie-session';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['asdfasfd'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
