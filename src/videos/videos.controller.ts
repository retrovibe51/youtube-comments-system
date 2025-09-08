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
import { VideosService } from './videos.service';
import { Video } from 'src/common/types';
import { AddVideoDto } from './dtos/request/add-video.dto';
import { GetVideoListDto } from './dtos/request/get-video-list.dto';
import { Pagination } from 'src/common/dtos/response/pagination.dto';
import { VideoListDto } from './dtos/response/video-list.dto';

@ApiTags('Video')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async getVideos(
    @Query() getVideoListDto: GetVideoListDto,
  ): Promise<
    ResponseTypeDTO<{ list: VideoListDto[]; pagination: Pagination }>
  > {
    return await this.videosService.getVideos(getVideoListDto);
  }

  @Post()
  async addVideo(@Body() addVideoDto: AddVideoDto) {
    return this.videosService.addVideo(addVideoDto);
  }

  @Delete()
  async deleteVideo(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.deleteVideo(id);
  }
}
