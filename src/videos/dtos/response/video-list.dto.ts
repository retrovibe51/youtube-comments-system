import { ApiProperty } from '@nestjs/swagger';

export class VideoListDto {
  @ApiProperty({
    readOnly: true,
    description: 'Video ID',
  })
  id: number;

  @ApiProperty({
    readOnly: true,
    description: 'Video title',
  })
  title: string;

  @ApiProperty({
    readOnly: true,
    description: 'Video description',
  })
  description: string | null;

  @ApiProperty({
    readOnly: true,
    description: 'Video media url',
  })
  mediaUrl: string;

  @ApiProperty({
    readOnly: true,
    description: 'Video creation timestamp',
  })
  createdAt: string;
}
