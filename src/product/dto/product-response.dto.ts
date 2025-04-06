import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Laptop' })
  name: string;

  @ApiProperty({ example: 'High-performance gaming laptop', required: false })
  description?: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 'http://example.com/laptop.jpg', required: false })
  imageUrl?: string;

  @ApiProperty({ example: 10 })
  stock: number;

  @ApiProperty({ example: 'Electronics', required: false })
  category?: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.imageUrl = product.imageUrl;
    this.stock = product.stock;
    this.category = product.category;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  products: ProductResponseDto[];

  @ApiProperty({ example: 1 })
  count: number;

  constructor(products: Product[]) {
    this.products = products.map((p) => new ProductResponseDto(p));
    this.count = products.length;
  }
}
