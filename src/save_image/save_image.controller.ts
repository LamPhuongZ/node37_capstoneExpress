import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SaveImageService } from './save_image.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Save-Image')
@Controller('save-image')
export class SaveImageController {
  constructor(private readonly saveImageService: SaveImageService) {}

  // Check whether the image is saved or not
  @HttpCode(HttpStatus.OK)
  @Get('check-image/:image_id')
  checkImage(@Param('image_id') image_id: number, @Res() res: Response) {
    return this.saveImageService.checkImage(Number(image_id), res);
  }

  // Get saved images list by user_id
  @HttpCode(HttpStatus.OK)
  @Get('get-saved-image-list')
  getSavedImageList(
    @Headers('Authorization') token: string,
    @Res() res: Response,
  ) {
    return this.saveImageService.getSavedImageList(token, res);
  }
}
