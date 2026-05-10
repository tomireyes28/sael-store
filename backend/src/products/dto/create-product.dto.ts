// src/products/dto/create-product.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsUUID, Min, Matches } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'El slug es obligatorio' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Formato de slug inválido' })
  slug!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price!: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[]; // Array de URLs, por ahora opcional

  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoryId!: string;
}