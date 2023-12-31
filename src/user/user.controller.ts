import {
  Controller,
  Get,
  UseGuards,
  Headers,
  Res,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { updateUserDto } from './dto/user.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get-user')
  getUser(@Headers('Authorization') token: string, @Res() res: Response) {
    return this.userService.getUserByToken(token, res);
  }

  // Update user's profile
  @Put('update-user')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          callback(null, new Date().getTime() + file.originalname);
        },
      }),
    }),
  )
  updateUser(
    @Headers('token') token,
    @Body() updateUser: updateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUser(token, updateUser, file);
  }
}
