import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDTO {
  @ApiProperty({ description: 'HTTP status code of the response' })
  status: string;

  @ApiProperty({ description: 'URL where the error occurred' })
  url: string;

  @ApiProperty({ description: 'HTTP method used for the request' })
  method: string;

  @ApiProperty({
    description:
      'Error message describing the issue, can be a string or an array of strings',
    type: [String],
    isArray: false,
    readOnly: true,
  })
  message: string | string[];

  @ApiProperty({ description: 'Timestamp when the error occurred' })
  timestamp: string;
}
