import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ProductResponseDto,
  ProductListResponseDto,
} from './dto/product-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product with the provided data',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid price value',
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Product with this name already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Product with this name already exists',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productService.createProduct(createProductDto);
      return new ProductResponseDto(product);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Returns a list of products with pagination and filtering options',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip',
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to take',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter products by name or description',
    example: 'laptop',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Sorting criteria as JSON string',
    examples: {
      nameAsc: { value: '{"name":"asc"}' },
      priceDesc: { value: '{"price":"desc"}' },
    },
  })
  @ApiOkResponse({
    description: 'List of products retrieved successfully',
    type: ProductListResponseDto,
  })
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('search') search?: string,
    @Query('orderBy') orderBy?: string,
  ) {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : undefined;

    const order = orderBy ? JSON.parse(orderBy) : undefined;

    const products = await this.productService.getAllProducts({
      skip,
      take,
      where,
      orderBy: order,
    });

    return new ProductListResponseDto(products);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Returns a single product by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with ID 1 not found',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productService.getProductById(id);
      return new ProductResponseDto(product);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Updates an existing product with the provided data',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID to update',
    example: 1,
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with ID 1 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid price value',
        error: 'Bad Request',
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await this.productService.updateProduct(
        id,
        updateProductDto,
      );
      return new ProductResponseDto(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product',
    description: 'Deletes a product by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID to delete',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Product deleted successfully',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with ID 1 not found',
        error: 'Not Found',
      },
    },
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productService.deleteProduct(id);
      return new ProductResponseDto(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('search/:query')
  @ApiOperation({
    summary: 'Search products',
    description: 'Searches products by name or description',
  })
  @ApiParam({
    name: 'query',
    description: 'Search query',
    example: 'laptop',
  })
  @ApiOkResponse({
    description: 'List of matching products',
    type: ProductListResponseDto,
  })
  async search(@Param('query') query: string) {
    const products = await this.productService.searchProducts(query);
    return new ProductListResponseDto(products);
  }
}
