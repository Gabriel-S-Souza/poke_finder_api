import { NestFactory } from '@nestjs/core';
import { AppModule } from './app_module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
