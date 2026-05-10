// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryService], // Lo exportamos por si otro módulo necesita borrar fotos después
})
export class CloudinaryModule {}