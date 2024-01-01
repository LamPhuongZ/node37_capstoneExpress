import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { createImageDto } from './dto/image.dto';

let url: string = null;

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
  getImageByName(@Query('image_name') image_name: string, @Res() res: Response) {
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

  // Upload new image
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'url', type: createImageDto })
  @UseInterceptors(
    FileInterceptor('url', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          url = new Date().getTime() + '_' + file.originalname;
          callback(null, url);
        },
      }),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('upload-image')
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file: Express.Multer.File,
    @Body() createImageDto: createImageDto,
    @Headers('Authorization') token: string,
    @Res() res: Response,
  ) {
    return this.imageService.uploadImage(createImageDto, url, token, res);
  }
}
