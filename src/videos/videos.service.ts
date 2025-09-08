import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';

import { ResponseTypeDTO } from 'src/common/dtos/response/response-type.dto';
import { Video } from 'src/common/types';
import { videos } from 'src/database/schema';
import { AddVideoDto } from './dtos/request/add-video.dto';
import { Pagination } from 'src/common/dtos/response/pagination.dto';
import { GetVideoListDto } from './dtos/request/get-video-list.dto';
import { VideoListDto } from './dtos/response/video-list.dto';

@Injectable()
export class VideosService {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: NodePgDatabase,
  ) {}

  async getVideos(
    getVideoListDto: GetVideoListDto,
  ): Promise<
    ResponseTypeDTO<{ list: VideoListDto[]; pagination: Pagination }>
  > {
    try {
      const { pageNo, limit } = getVideoListDto;

      const offset = (pageNo - 1) * limit;

      const videoList: VideoListDto[] = await this.db
        .select({
          id: videos.id,
          title: videos.title,
          description: videos.description,
          mediaUrl: videos.mediaUrl,
          createdAt: videos.createdAt,
        })
        .from(videos)
        .where(eq(videos.isDeleted, false))
        .limit(limit)
        .offset(offset);

      const count = await this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(videos)
        .where(eq(videos.isDeleted, false))
        .then((res) => res[0]?.count ?? 0);

      const pagination: Pagination = {
        limit,
        pageNo,
        numberOfPages: Math.ceil(count / limit),
        totalItemCount: count,
      };

      return {
        status: HttpStatus.OK,
        message: 'Fetched video list.',
        data: { list: videoList, pagination },
      };
    } catch (error) {
      throw new HttpException(
        'There was an error on fetching the video list.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addVideo(addVideoDto: AddVideoDto) {
    try {
      await this.db.insert(videos).values(addVideoDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Video added successfully.',
      };
    } catch (error) {
      throw new HttpException(
        'There was an error on deleting the video.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteVideo(id: number) {
    try {
      await this.db
        .update(videos)
        .set({
          isDeleted: true,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(videos.id, id));

      return { status: HttpStatus.OK, message: 'Video deleted successfully.' };
    } catch (error) {
      throw new HttpException(
        'There was an error on deleting the video.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
