import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import 'multer'; // <-- Mismo fix para los tipos

@Controller('images')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No se envió ningún archivo');
    }

    const result = await this.cloudinaryService.uploadImage(file);
    
    return { url: result.secure_url };
  }
}