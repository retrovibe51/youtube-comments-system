import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    maxLength: 100,
    example: 'John Connor',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    description: 'Username of the user',
    maxLength: 100,
    example: 'johnconnor100',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  username: string;
}
