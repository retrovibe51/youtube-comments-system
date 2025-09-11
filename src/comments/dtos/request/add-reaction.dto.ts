import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ReactionTypeEnum } from 'src/comments/enums/reaction-type.enum';

export class AddReactionDto {
  @ApiProperty({
    description: 'ID of the comment',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  commentId: number;

  @ApiProperty({
    description: 'ID of user who made the reaction',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'The type of reaction: like or dislike',
    enum: ReactionTypeEnum,
    default: ReactionTypeEnum.LIKE,
  })
  @IsEnum(ReactionTypeEnum)
  reactionType: ReactionTypeEnum;
}
