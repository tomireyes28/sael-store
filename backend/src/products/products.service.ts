// src/products/products.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existing = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existing) {
      throw new ConflictException('Ya existe un producto con este slug');
    }

    // Verificamos que la categoría exista antes de crear el producto
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException('La categoría especificada no existe');
    }

    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        category: true, // Trae los datos de la liga anidada
        variants: true, // Trae los talles (por ahora va a venir vacío)
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async remove(id: string): Promise<Product> {
    await this.findOne(id); // Validamos que exista
    return this.prisma.product.delete({ where: { id } });
  }
}