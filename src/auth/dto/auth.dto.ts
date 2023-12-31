import { ApiProperty } from '@nestjs/swagger';

export class authDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  pass_word: string;
}
