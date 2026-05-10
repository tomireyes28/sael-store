// src/variants/variants.controller.ts
import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { ProductVariant } from '@prisma/client';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createVariantDto: CreateVariantDto): Promise<ProductVariant> {
    return this.variantsService.create(createVariantDto);
  }

  @Get('product/:productId')
  getByProduct(@Param('productId') productId: string): Promise<ProductVariant[]> {
    return this.variantsService.getByProduct(productId);
  }
}