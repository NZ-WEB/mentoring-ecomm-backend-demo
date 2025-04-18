import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, ProductService],
})
export class CartModule {}
