import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  Res,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { createCommentDto } from './dto/comment.dto';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Get comments by image_id
  @HttpCode(HttpStatus.OK)
  @Get('get-comments-by-img-id/:image_id')
  getCommentsByImgId(@Param('image_id') image_id: number, @Res() res: Response) {
    return this.commentService.getCommentsByImgId(+image_id, res);
  }

  // Save user's comments on image
  @HttpCode(HttpStatus.CREATED)
  @Post('save-comment')
  saveComment(@Body() body: createCommentDto, @Res() res: Response) {
    return this.commentService.saveComment(body, res);
  }
}
