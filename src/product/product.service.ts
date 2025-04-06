import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: Prisma.ProductCreateInput) {
    try {
      return await this.prisma.product.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllProducts(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.product.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async searchProducts(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              ...(process.env.DB_TYPE === 'postgresql' && {
                mode: 'insensitive',
              }),
            },
          },
          {
            description: {
              contains: query,
              ...(process.env.DB_TYPE === 'postgresql' && {
                mode: 'insensitive',
              }),
            },
          },
        ],
      },
    });
  }

  async updateProduct(id: number, data: Prisma.ProductUpdateInput) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async deleteProduct(id: number) {
    try {
      await this.prisma.cartItem.deleteMany({ where: { productId: id } });
      await this.prisma.wishlistItem.deleteMany({ where: { productId: id } });
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  private handlePrismaError(error: any, id?: number) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new Error('Product with this name already exists');
        case 'P2025':
          throw new NotFoundException(`Product with ID ${id} not found`);
        default:
          throw new Error(`Prisma error: ${error.message}`);
      }
    }
    throw error;
  }
}
