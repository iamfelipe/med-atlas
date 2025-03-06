import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app
    .useGlobalPipes(new ValidationPipe())
    .listen(process.env.PORT ?? 5005)
    .then(() => {
      console.log(`Server is running on localhost:${process.env.PORT ?? 5005}`);
    })
    .catch((err) => console.error(err));
}
bootstrap().catch((err) => console.error(err));
