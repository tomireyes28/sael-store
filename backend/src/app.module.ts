import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';

@Module({
  imports: [PrismaModule, AuthModule, CategoriesModule, ProductsModule, VariantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
