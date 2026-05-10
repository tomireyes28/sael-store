// src/variants/variants.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { ProductVariant } from '@prisma/client';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVariantDto: CreateVariantDto): Promise<ProductVariant> {
    // Validamos que el producto padre exista
    const product = await this.prisma.product.findUnique({
      where: { id: createVariantDto.productId },
    });

    if (!product) {
      throw new NotFoundException('El producto no existe');
    }

    // Evitamos duplicar un mismo talle para el mismo producto
    const existingVariant = await this.prisma.productVariant.findFirst({
      where: {
        productId: createVariantDto.productId,
        size: createVariantDto.size,
      },
    });

    if (existingVariant) {
      throw new BadRequestException(`El talle ${createVariantDto.size} ya está cargado en este producto`);
    }

    return this.prisma.productVariant.create({
      data: createVariantDto,
    });
  }

  async getByProduct(productId: string): Promise<ProductVariant[]> {
    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { size: 'asc' }, // Ordena los talles
    });
  }

  // 🔥 Esta es la función crítica para el momento del pago
  async decreaseStock(id: string, quantity: number): Promise<ProductVariant> {
    const variant = await this.prisma.productVariant.findUnique({ where: { id } });
    
    if (!variant) throw new NotFoundException('Talle no encontrado');
    if (variant.stock < quantity) throw new BadRequestException('Stock insuficiente para esta compra');

    // Actualización atómica directa en la DB
    return this.prisma.productVariant.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }
}