import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrdersModule } from './orders/orders.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [PrismaModule, AuthModule, CategoriesModule, ProductsModule, VariantsModule, CloudinaryModule, OrdersModule, ShippingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
