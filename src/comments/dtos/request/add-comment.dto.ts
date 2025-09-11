import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AddCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    maxLength: 1000,
    example: 'This is an awesome video!',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: 'ID of the user making the comment',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID of the video on which the comment is being made',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  videoId: number;

  @ApiPropertyOptional({
    description: 'ID of the comment to which a reply is being made',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  parentCommentId?: number;
}
