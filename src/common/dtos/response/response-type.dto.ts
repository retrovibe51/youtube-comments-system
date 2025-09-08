import { ApiProperty } from '@nestjs/swagger';

export class ResponseTypeDTO<T> {
  @ApiProperty({
    description: 'HTTP status code',
    readOnly: true,
  })
  status: number;

  @ApiProperty({
    description: 'Response message',
    readOnly: true,
  })
  message: string;

  @ApiProperty({
    required: false,
    readOnly: true,
  })
  data?: T;
}
