import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // Get images list
  @HttpCode(HttpStatus.OK)
  @Get('get-image-list')
  getImageList(@Res() res: Response) {
    return this.imageService.getImageList(res);
  }

  // Get image by image_name
  @HttpCode(HttpStatus.OK)
  @Get('get-image-by-name')
  getImageByName(@Body() image_name: string, @Res() res: Response) {
    return this.imageService.getImageByName(image_name, res);
  }

  // Get image's info and its creator by image_id
  @HttpCode(HttpStatus.OK)
  @Get('get-info-by-img-id/:image_id')
  getInfoByImageId(@Param('image_id') image_id: number, @Res() res: Response) {
    return this.imageService.getInfoByImageId(Number(image_id), res);
  }

  // Get created images list by user_id
  @HttpCode(HttpStatus.OK)
  @Get('get-created-image-list')
  getCreatedImageList(
    @Headers('Authorization') token: string,
    @Res() res: Response,
  ) {
    return this.imageService.getCreatedImageList(token, res);
  }

  // Delete created image by image_id
  @HttpCode(HttpStatus.OK)
  @Delete('remove-image/:image_id')
  removeCreatedImage(
    @Param('image_id') image_id: string,
    @Headers('Authorization') token: string,
    @Res() res: Response,
  ) {
    return this.imageService.removeCreatedImage(+image_id, token, res);
  }
s
  // Upload new image
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
  @Post('upload-image')
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description: string,
    @Headers('Authorization') token: string,
    @Res() res: Response,
  ) {
    return this.imageService.uploadImage(file, description, token, res);
  }
}
