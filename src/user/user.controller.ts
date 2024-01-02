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
  HttpStatus,
  HttpCode,
  ParseFilePipe,
  FileTypeValidator,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { updateUserDto, updateUserUploadDto } from './dto/user.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadDto } from 'src/file-upload.dto';

let imageUrl: string = null;

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



  @HttpCode(HttpStatus.OK)
  @Put('update-user')
  updateUserDetail(
    @Headers('Authorization') token: string,
    @Body() updateUserDto: updateUserDto,
    @Res() res: Response,
  ) {
    return this.userService.updateUserDetail(token, updateUserDto, res);
  }

  // Chưa tìm được cách xử lý nên tạm ẩn đi
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ description: 'avatar', type: updateUserUploadDto })
  // @UseInterceptors(
  //   FileInterceptor('avatar', {
  //     storage: diskStorage({
  //       destination: process.cwd() + '/public/avatar',
  //       filename: (req, file, callback) => {
  //         imageUrl = new Date().getTime() + '_' + file.originalname;
  //         callback(null, imageUrl);
  //       },
  //     }),
  //   }),
  // )
  // @HttpCode(HttpStatus.OK)
  // @Put('update-user-upload')
  // updateUserDetailUpload(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: 'image/*' })],
  //     }),
  //   )
  //   avatar: Express.Multer.File,
  //   @Headers('Authorization') token: string,
  //   @Body() updateUserUploadDto: updateUserUploadDto,
  //   @Res() res: Response,
  // ) {
  //   return this.userService.updateUserDetailUpload(
  //     token,
  //     updateUserUploadDto,
  //     imageUrl,
  //     res,
  //   );
  // }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'avatar', type: fileUploadDto })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: process.cwd() + '/public/avatar',
        filename: (req, file, callback) => {
          imageUrl = new Date().getTime() + '_' + file.originalname;
          callback(null, imageUrl);
        },
      }),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('upload-avatar/:user_id')
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    avatar: Express.Multer.File,
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ) {
    return this.userService.uploadAvatar(imageUrl, +user_id, res);
  }
}
