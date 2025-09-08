import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddVideoDto {
  @ApiProperty({
    description: 'Title of the video',
    maxLength: 255,
    example: 'Weather forecast',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the video.',
    maxLength: 1000,
    example: 'This is the weather forecast for today.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Url of the video',
    maxLength: 2048,
    example: 'https://your-bucket-name.s3.amazonaws.com/your-video.mp4',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2048)
  mediaUrl: string;
}
