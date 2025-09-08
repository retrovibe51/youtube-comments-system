import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { eq, sql, and, isNull } from 'drizzle-orm';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pagination } from 'src/common/dtos/response/pagination.dto';
import { ResponseTypeDTO } from 'src/common/dtos/response/response-type.dto';
import { Comment } from 'src/common/types';
import { commentReactions, comments, users } from 'src/database/schema';
import { GetVideoListDto } from 'src/videos/dtos/request/get-video-list.dto';
import { AddCommentDto } from './dtos/request/add-comment.dto';
import { CommentListDto } from './dtos/response/comment-list.dto';
import { GetCommentListDto } from './dtos/request/get-comment-list.dto';
import { CommentListSortEnum } from './enums/comment-list-sort-enum';
import { AddReactionDto } from './dtos/request/add-reaction.dto';
import { videos } from 'drizzle/schema';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: NodePgDatabase,
  ) {}

  async getComments(
    getCommentListDto: GetCommentListDto,
  ): Promise<
    ResponseTypeDTO<{ list: CommentListDto[]; pagination: Pagination }>
  > {
    const { pageNo, limit, videoId, parentCommentId, sortBy, userId } =
      getCommentListDto;

    const offset = (pageNo - 1) * limit;

    const existingVideo = await this.db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .then((rows) => rows[0]);

    if (!existingVideo) {
      throw new HttpException('Video not found.', HttpStatus.NOT_FOUND);
    }

    const conditions = [
      eq(comments.isDeleted, false),
      eq(comments.videoId, videoId),
    ];

    if (typeof parentCommentId === 'number' && parentCommentId > 0) {
      const existingParentComment = await this.db
        .select()
        .from(comments)
        .where(eq(comments.id, parentCommentId))
        .then((rows) => rows[0]);

      if (!existingParentComment) {
        throw new HttpException(
          'Parent comment not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      conditions.push(eq(comments.parentCommentId, parentCommentId));
    } else {
      conditions.push(isNull(comments.parentCommentId));
    }

    const sortClause =
      sortBy === CommentListSortEnum.TOP_COMMENTS
        ? sql`
            COUNT(*) FILTER (WHERE ${commentReactions.reactionType} = 'like') -
            COUNT(*) FILTER (WHERE ${commentReactions.reactionType} = 'dislike') DESC
          `
        : sql`${comments.createdAt} DESC`;

    try {
      const commentList: CommentListDto[] = await this.db
        .select({
          id: comments.id,
          content: comments.content,
          user: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
          },
          isEdited: comments.isEdited,
          createdAt: comments.createdAt,
          likeCount: sql<number>`COUNT(*) FILTER (WHERE ${commentReactions.reactionType} = 'like')`,
          dislikeCount: sql<number>`COUNT(*) FILTER (WHERE ${commentReactions.reactionType} = 'dislike')`,
          ...(userId
            ? {
                userReaction: sql<string | null>`(
                  SELECT reaction_type
                  FROM ${commentReactions}
                  WHERE ${commentReactions.commentId} = ${comments.id}
                    AND ${commentReactions.userId} = ${userId}
                  LIMIT 1
                )`,
              }
            : {
                userReaction: sql<string | null>`NULL`,
              }),
          ...(typeof parentCommentId === 'number' &&
            parentCommentId > 0 && {
              replyCount: sql<number>`(
            SELECT COUNT(*) FROM ${comments} AS replies
            WHERE replies.parent_comment_id = ${comments.id}
            AND replies.is_deleted = FALSE
          )`,
            }),
        })
        .from(comments)
        .innerJoin(users, eq(comments.userId, users.id))
        .leftJoin(commentReactions, eq(comments.id, commentReactions.commentId))
        .where(and(...conditions))
        .groupBy(comments.id, users.id, users.username, users.fullName)
        .orderBy(sortClause)
        .limit(limit)
        .offset(offset);

      const count = await this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(comments)
        .where(and(...conditions))
        .then((res) => res[0]?.count ?? 0);

      const pagination: Pagination = {
        limit,
        pageNo,
        numberOfPages: Math.ceil(count / limit),
        totalItemCount: count,
      };

      return {
        status: HttpStatus.OK,
        message: 'Fetched comment list.',
        data: { list: commentList, pagination },
      };
    } catch (error) {
      throw new HttpException(
        'There was an error on fetching the comment list.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addComment(
    addCommentDto: AddCommentDto,
  ): Promise<ResponseTypeDTO<void>> {
    try {
      await this.db.insert(comments).values(addCommentDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Comment added successfully.',
      };
    } catch (error) {
      throw new HttpException(
        'There was an error on adding the comment.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteComment(id: number): Promise<ResponseTypeDTO<void>> {
    try {
      await this.db
        .update(comments)
        .set({
          isDeleted: true,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(comments.id, id));

      return { status: HttpStatus.OK, message: 'Video deleted successfully.' };
    } catch (error) {
      throw new HttpException(
        'There was an error on deleting the comment.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addReaction(
    addReactionDto: AddReactionDto,
  ): Promise<ResponseTypeDTO<void>> {
    const { commentId, userId, reactionType } = addReactionDto;

    const existingComment = await this.db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .then((rows) => rows[0]);

    if (!existingComment) {
      throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);
    }

    try {
      const existingReaction = await this.db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
          ),
        )
        .then((rows) => rows[0]);

      if (!existingReaction) {
        // adding a reaction
        await this.db.insert(commentReactions).values({
          commentId,
          userId,
          reactionType,
        });

        return {
          status: HttpStatus.OK,
          message: 'Reaction added successfully.',
        };
      } else if (reactionType === existingReaction.reactionType) {
        // removing existing reaction
        await this.db
          .delete(commentReactions)
          .where(eq(commentReactions.id, existingReaction.id));

        return {
          status: HttpStatus.OK,
          message: 'Reaction removed successfully.',
        };
      } else {
        // changing existing reaction
        await this.db
          .update(commentReactions)
          .set({ reactionType: addReactionDto.reactionType })
          .where(eq(commentReactions.id, existingReaction.id));

        return {
          status: HttpStatus.OK,
          message: 'Reaction added successfully.',
        };
      }
    } catch (error) {
      throw new HttpException(
        'There was an error on adding a reaction.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
