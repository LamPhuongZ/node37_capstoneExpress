import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { createUserDto } from 'src/user/dto/user.dto';
import { authDto } from './dto/auth.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  signUp(@Body() body: createUserDto, @Res() res: Response) {
    return this.authService.signUp(body, res);
  }

  // @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() body: authDto, @Res() res: Response) {
    return this.authService.login(body, res);
  }
}
