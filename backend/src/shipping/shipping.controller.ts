// backend/src/shipping/shipping.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('calculate/:zipCode')
  calculate(@Param('zipCode') zipCode: string) {
    return this.shippingService.calculateShipping(zipCode);
  }
}