import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Log current working directory for debugging
  console.log('Current working directory:', process.cwd());
  console.log('Static assets path:', join(process.cwd(), 'Uploads'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      disableErrorMessages: false,
      skipMissingProperties: true,
      validationError: { target: false, value: false },
    }),
  );
  // Serve static files from the Uploads directory
  app.useStaticAssets(join(process.cwd(), 'Uploads'), {
    prefix: '/uploads/',
    setHeaders: (res) => {
      res.setHeader('Content-Type', 'image/jpeg');
    },
  });

  // Enable CORS
  app.enableCors({
    origin: '*', // Update with frontend URL in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3002);
  console.log('Server running on http://192.168.0.102:3002');
}
bootstrap();
