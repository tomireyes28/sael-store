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

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // 1. Buscar por ID (Uso interno: Admin, Update, Delete)
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

  // 2. Buscar por Slug (Uso público: Tienda)
  async findBySlug(slug: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true, variants: true },
    });

    if (!product) {
      throw new NotFoundException(`Producto con slug ${slug} no encontrado`);
    }

    return product;
  }

  // Ahora el remove funciona perfecto validando por ID
  async remove(id: string): Promise<Product> {
    await this.findOne(id); 
    return this.prisma.product.delete({ where: { id } });
  }
}