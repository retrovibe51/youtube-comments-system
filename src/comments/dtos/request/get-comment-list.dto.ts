import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CommentListSortEnum } from 'src/comments/enums/comment-list-sort-enum';

export class GetCommentListDto {
  @ApiProperty({
    description: 'Page number of the result set',
    default: 1,
    minimum: 1,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  pageNo: number;

  @ApiProperty({
    description: 'The records per page of the result set',
    default: 10,
    minimum: 1,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number;

  @ApiPropertyOptional({
    description: 'ID of parent comment',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  parentCommentId?: number;

  @ApiProperty({
    description: 'ID of video',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  videoId: number;

  @ApiProperty({
    description: 'The type of sorting: newest_comments or top_comments',
    enum: CommentListSortEnum,
    default: CommentListSortEnum.NEWEST_COMMENTS,
  })
  @IsEnum(CommentListSortEnum)
  sortBy?: CommentListSortEnum;

  @ApiPropertyOptional({
    description:
      'ID of user viewing comments. This is not a filter but rather is used for indication of the reaction a specific user',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  userId?: number;
}
