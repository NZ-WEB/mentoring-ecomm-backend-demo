import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 1, default: 1, required: false })
  quantity?: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 1 })
  cartId: number;

  @ApiProperty({ example: 1 })
  itemId: number;

  @ApiProperty({ example: 2 })
  quantity: number;
}
