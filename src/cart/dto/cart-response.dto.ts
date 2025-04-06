import { ApiProperty } from '@nestjs/swagger';
import { Cart, CartItem, Product } from '@prisma/client';

class CartItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };

  constructor(item: CartItem & { product: Product }) {
    this.id = item.id;
    this.productId = item.productId;
    this.quantity = item.quantity;
    this.product = {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
    };
  }
}

export class CartResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: [CartItemDto] })
  items: CartItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  itemsCount: number;

  constructor(cart: Cart & { items: (CartItem & { product: Product })[] }) {
    this.id = cart.id;
    this.userId = cart.userId;
    this.items = cart.items.map((item) => new CartItemDto(item));
    this.total = this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    this.itemsCount = this.items.reduce(
      (count, item) => count + item.quantity,
      0,
    );
  }
}
