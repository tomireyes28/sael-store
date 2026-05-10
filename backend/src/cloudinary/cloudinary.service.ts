import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import 'multer'; // <-- Esto soluciona el error global.Express

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    // Validamos que sea JPG sí o sí para mantener el formato impecable
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
      throw new BadRequestException('Solo se permiten archivos en formato JPG');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sael_store',
          format: 'jpg',
        },
        (error, result) => {
          // ESLint pide que los rechazos sean instancias de Error
          if (error) return reject(new Error(error.message || 'Error al subir a Cloudinary'));
          if (!result) return reject(new Error('Error desconocido al subir la imagen'));
          
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}