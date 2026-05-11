// src/orders/dto/create-order.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID('4', { message: 'El ID de la variante debe ser válido' })
  @IsNotEmpty()
  variantId!: string;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  customerName!: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty()
  customerEmail!: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress!: string;

  @IsString()
  @IsNotEmpty()
  shippingZip!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty({ message: 'El carrito no puede estar vacío' })
  items!: OrderItemDto[];

  @IsString()
  @IsOptional()
  couponCode?: string; // Por si usa el cupón de descuento que agregamos a la DB
}