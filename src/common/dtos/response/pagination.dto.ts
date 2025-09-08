import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty({ description: 'The maximum number of items per page' })
  limit: number;

  @ApiProperty({ description: 'The current page number' })
  pageNo: number;

  @ApiProperty({ description: 'The total number of pages available' })
  numberOfPages: number;

  @ApiProperty({ description: 'The total number items available' })
  totalItemCount: number;
}
