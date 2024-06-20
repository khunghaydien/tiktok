import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Allow cookies and authorization headers
    allowedHeaders: [
      'Accept',
      'Authorization',
      'X-Requested-With',
      'apollo-require-preflight',
      'Content-Type', // Add any additional headers your client may need
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // HTTP methods allowed
  });

  // Use cookie parser middleware
  app.use(cookieParser());

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any extra properties that are not defined in the DTO
      transform: true, // Automatically transforms payloads to DTO instances
      exceptionFactory(errors) {
        const formattedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = Object.values(error.constraints).join(', ');
          return accumulator;
        }, {});
        throw new BadRequestException(formattedErrors);
      },
    }),
  );

  // Start the application on port 3001
  await app.listen(3001);
}

bootstrap();