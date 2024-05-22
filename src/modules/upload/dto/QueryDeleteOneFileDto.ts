import { ApiProperty } from '@nestjs/swagger';

export class QueryDeleteOneFileDto {
  @ApiProperty()
  fileKey?: string;
}
