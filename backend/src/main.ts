// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Agregamos esta línea para darle permiso al frontend (puerto 3001) de pegarle al backend
  app.enableCors({
    origin: 'http://localhost:3001', // O podés poner '*' para permitir todo por ahora
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();