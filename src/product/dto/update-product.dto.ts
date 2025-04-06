import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class UpdateProductDto implements Prisma.ProductUpdateInput {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  stock?: number;

  @ApiProperty({ required: false })
  category?: string;
}
