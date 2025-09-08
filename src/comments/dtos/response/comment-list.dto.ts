import { ApiProperty } from '@nestjs/swagger';
import type { User } from 'src/common/types';

export class CommentListDto {
  @ApiProperty({
    readOnly: true,
    description: 'Comment ID',
  })
  id: number;

  @ApiProperty({
    readOnly: true,
    description: 'Video title',
  })
  content: string;

  @ApiProperty({
    readOnly: true,
    description: 'Video description',
  })
  isEdited: boolean;

  @ApiProperty({
    readOnly: true,
    description: 'Video media url',
  })
  user: User;

  @ApiProperty({
    readOnly: true,
    description: 'Video creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    readOnly: true,
    description: 'Comment ID',
  })
  likeCount: number;

  @ApiProperty({
    readOnly: true,
    description: 'Comment ID',
  })
  dislikeCount: number;

  @ApiProperty({
    readOnly: true,
    description: 'Comment ID',
  })
  replyCount?: number;
}
