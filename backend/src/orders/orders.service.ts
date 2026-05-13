import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    let totalAmount = 0;
    // Fix 1: Cambiamos a const
    const shippingCost = 0; 
    
    // Fix 2: Tipado explícito para que sepa qué le vamos a pushear
    const orderItemsData: { variantId: string; quantity: number; price: number }[] = [];

    for (const item of createOrderDto.items) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new BadRequestException(`El talle con ID ${item.variantId} no existe`);
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para ${variant.product.name} (Talle: ${variant.size})`);
      }

      const itemTotal = variant.product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        variantId: variant.id,
        quantity: item.quantity,
        price: variant.product.price,
      });
    }

    // Fix 3: Le aclaramos que puede arrancar en null pero después ser un string
    let appliedCouponId: string | null = null;
    
    if (createOrderDto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: createOrderDto.couponCode },
      });

      if (!coupon || !coupon.isActive) {
        throw new BadRequestException('Cupón inválido o inactivo');
      }

      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
        throw new BadRequestException('El cupón ha alcanzado su límite de usos');
      }

      const discount = (totalAmount * coupon.discountPercentage) / 100;
      totalAmount -= discount;
      appliedCouponId = coupon.id;

      await this.prisma.coupon.update({
        where: { id: coupon.id },
        data: { currentUses: { increment: 1 } },
      });
    }

    totalAmount += shippingCost;

    return this.prisma.order.create({
      data: {
        customerName: createOrderDto.customerName,
        customerEmail: createOrderDto.customerEmail,
        customerPhone: createOrderDto.customerPhone,
        shippingAddress: createOrderDto.shippingAddress,
        shippingZip: createOrderDto.shippingZip,
        shippingCost,
        totalAmount,
        status: 'PENDING',
        couponId: appliedCouponId,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}