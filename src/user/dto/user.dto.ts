import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty({ description: 'email', type: String })
  email: string;

  @ApiProperty({ description: 'password', type: String })
  pass_word: string;

  @ApiProperty({ description: 'fullname', type: String })
  full_name: string;

  @ApiProperty({ description: 'age', type: Number })
  age: number;
}

export class updateUserDto {
  @ApiProperty({ description: 'password', type: String })
  pass_word: string;

  @ApiProperty({ description: 'fullname', type: String })
  full_name: string;

  @ApiProperty({ description: 'age', type: Number })
  age: number;
}

export class updateUserUploadDto {
  @ApiProperty({ description: 'password', type: String })
  pass_word: string;

  @ApiProperty({ description: 'fullname', type: String })
  full_name: string;

  @ApiProperty({ description: 'age', type: Number })
  age: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: any;
}
