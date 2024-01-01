import { ApiProperty } from '@nestjs/swagger';

export class authDto {
  @ApiProperty({ description: 'email', type: String })
  email: string;

  @ApiProperty({ description: 'password', type: String })
  pass_word: string;
}
