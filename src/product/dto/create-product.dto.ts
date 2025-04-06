import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateProductDto implements Prisma.ProductCreateInput {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false, default: 0 })
  stock?: number;

  @ApiProperty({ required: false })
  category?: string;
}
