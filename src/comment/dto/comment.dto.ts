import { ApiProperty } from '@nestjs/swagger';

export class createCommentDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  image_id: number;

  @ApiProperty()
  content: string;
}
