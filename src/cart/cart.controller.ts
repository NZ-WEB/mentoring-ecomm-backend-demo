import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart-request.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Get user cart',
    description: 'Retrieves the current user cart with all items',
  })
  @ApiOkResponse({
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  async getCart(@Query('userId', ParseIntPipe) userId: number) {
    return this.cartService.getUserCart(userId);
  }

  @Post('add')
  @ApiOperation({
    summary: 'Add item to cart',
    description:
      'Adds a product to the user cart or increases quantity if already exists',
  })
  @ApiBody({ type: AddToCartDto })
  @ApiCreatedResponse({
    description: 'Item added to cart successfully',
    type: CartResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid quantity',
  })
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(
      addToCartDto.userId,
      addToCartDto.productId,
      addToCartDto.quantity,
    );
  }

  @Patch('update')
  @ApiOperation({
    summary: 'Update cart item',
    description: 'Updates the quantity of a specific item in the cart',
  })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiOkResponse({
    description: 'Cart item updated successfully',
    type: CartResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cart or item not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid quantity',
  })
  async updateCartItem(@Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(
      updateCartItemDto.cartId,
      updateCartItemDto.itemId,
      updateCartItemDto.quantity,
    );
  }

  @Delete('remove/:itemId')
  @ApiOperation({
    summary: 'Remove item from cart',
    description: 'Removes a specific item from the cart',
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID of the cart item to remove',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Item removed successfully',
    type: CartResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cart or item not found',
  })
  async removeFromCart(
    @Query('cartId', ParseIntPipe) cartId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeFromCart(cartId, itemId);
  }

  @Delete('clear')
  @ApiOperation({
    summary: 'Clear cart',
    description: 'Removes all items from the user cart',
  })
  @ApiQuery({
    name: 'userId',
    description: 'User ID whose cart should be cleared',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Cart cleared successfully',
    type: CartResponseDto,
  })
  async clearCart(@Query('userId', ParseIntPipe) userId: number) {
    return this.cartService.clearCart(userId);
  }

  @Get('total')
  @ApiOperation({
    summary: 'Calculate cart total',
    description: 'Calculates the total sum of all items in the cart',
  })
  @ApiQuery({
    name: 'userId',
    description: 'User ID to calculate cart total',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Cart total calculated',
    schema: {
      example: {
        total: 199.98,
      },
    },
  })
  async getCartTotal(@Query('userId', ParseIntPipe) userId: number) {
    const total = await this.cartService.calculateCartTotal(userId);
    return { total };
  }

  @Get('count')
  @ApiOperation({
    summary: 'Get cart items count',
    description: 'Returns the total number of items in the cart',
  })
  @ApiQuery({
    name: 'userId',
    description: 'User ID to get items count',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Cart items count',
    schema: {
      example: {
        count: 3,
      },
    },
  })
  async getCartItemsCount(@Query('userId', ParseIntPipe) userId: number) {
    const count = await this.cartService.getCartItemsCount(userId);
    return { count };
  }

  @Get('check/:productId')
  @ApiOperation({
    summary: 'Check if product is in cart',
    description: 'Checks if a specific product exists in the user cart',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID to check',
    example: 1,
  })
  @ApiQuery({
    name: 'userId',
    description: 'User ID to check cart',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Check result',
    schema: {
      example: {
        exists: true,
      },
    },
  })
  async isProductInCart(
    @Query('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const exists = await this.cartService.isProductInCart(userId, productId);
    return { exists };
  }
}
