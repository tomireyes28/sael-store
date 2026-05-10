// src/variants/dto/create-variant.dto.ts
import { IsNotEmpty, IsString, IsInt, Min, IsUUID } from 'class-validator';

export class CreateVariantDto {
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  productId!: string;

  @IsString()
  @IsNotEmpty({ message: 'El talle es obligatorio' })
  size!: string; // Ej: 'S', 'M', 'L', 'XL'

  @IsInt()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock!: number;
}