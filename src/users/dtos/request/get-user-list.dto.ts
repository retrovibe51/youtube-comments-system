import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserListDto {
  @ApiProperty({
    default: 1,
    minimum: 1,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  pageNo: number;

  @ApiProperty({
    default: 10,
    minimum: 1,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number;
}
