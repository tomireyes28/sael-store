// backend/src/orders/orders.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '@prisma/client';
import { MailService } from '../mail/mail.service'; // 1. Importamos el servicio de correos

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService // 2. Lo inyectamos en el constructor
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    let totalAmount = 0;
    
    // NOTA: Para la Fase 5, acordate de que este shippingCost debería venir del DTO
    // y no estar en 0 fijo, así te cobra el envío real!
    const shippingCost = createOrderDto.shippingCost || 0; 
    
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

    // Guardamos la orden en una variable en vez de retornarla directo
    const order = await this.prisma.order.create({
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

    // 3. Disparamos el correo (No le ponemos await para que no demore la respuesta al cliente)
   await this.mailService.sendOrderConfirmation(order.customerName, order.totalAmount);

    return order;
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