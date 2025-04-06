import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
  ) {}

  async createCart(userId: number) {
    return this.prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getUserCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return this.createCart(userId);
    }

    return cart;
  }

  async addToCart(userId: number, productId: number, quantity: number = 1) {
    await this.productService.getProductById(productId);

    const cart = await this.getUserCart(userId);

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      return this.updateCartItem(
        cart.id,
        existingItem.id,
        existingItem.quantity + quantity,
      );
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async updateCartItem(cartId: number, itemId: number, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(cartId, itemId);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
      },
    });
  }

  async removeFromCart(cartId: number, itemId: number) {
    return this.prisma.cartItem.delete({
      where: {
        id: itemId,
        cartId: cartId,
      },
      include: {
        product: true,
      },
    });
  }

  async clearCart(userId: number) {
    const cart = await this.getUserCart(userId);
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  async calculateCartTotal(userId: number) {
    const cart = await this.getUserCart(userId);
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  async getCartItemsCount(userId: number) {
    const cart = await this.getUserCart(userId);
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  async isProductInCart(userId: number, productId: number) {
    const cart = await this.getUserCart(userId);
    return cart.items.some((item) => item.productId === productId);
  }
}
