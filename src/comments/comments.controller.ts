import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseTypeDTO } from 'src/common/dtos/response/response-type.dto';
import { GetCommentListDto } from './dtos/request/get-comment-list.dto';
import { CommentsService } from './comments.service';
import { Pagination } from 'src/common/dtos/response/pagination.dto';
import { AddCommentDto } from './dtos/request/add-comment.dto';
import { CommentListDto } from './dtos/response/comment-list.dto';
import { AddReactionDto } from './dtos/request/add-reaction.dto';

@ApiTags('Comment')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getComments(
    @Query() getCommentListDto: GetCommentListDto,
  ): Promise<
    ResponseTypeDTO<{ list: CommentListDto[]; pagination: Pagination }>
  > {
    return await this.commentsService.getComments(getCommentListDto);
  }

  @Post()
  async addComment(
    @Body() addCommentDto: AddCommentDto,
  ): Promise<ResponseTypeDTO<void>> {
    return this.commentsService.addComment(addCommentDto);
  }

  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseTypeDTO<void>> {
    return this.commentsService.deleteComment(id);
  }

  @Post('/reaction')
  async addReaction(
    @Body() addReactionDto: AddReactionDto,
  ): Promise<ResponseTypeDTO<void>> {
    return this.commentsService.addReaction(addReactionDto);
  }
}
