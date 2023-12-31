import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { createCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private jwtService: JwtService) {}

  prisma = new PrismaClient();

  // Get comments by image_id
  async getCommentsByImgId(image_id: number, res: Response) {
    try {
      let checkImage = await this.prisma.tblImage.findFirst({
        where: {
          image_id,
        },
      });

      if (checkImage) {
        let comment = await this.prisma.tblComment.findMany({
          where: {
            image_id,
          },
        });

        if (comment.length > 0) {
          return res.status(HttpStatus.OK).json({
            statusCode: 200,
            message: "Get data successfully",
            content: comment,
          });
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: 406,
            message: 'This image has no comment!',
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Image not found',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Save user's comments on image
  async saveComment(userComment: createCommentDto, res: Response) {
    try {
      const checkImageExist = await this.prisma.tblImage.findFirst({
        where: {
          image_id: userComment.image_id,
        },
      });
      const checkUserExist = await this.prisma.tblUser.findFirst({
        where: {
          user_id: userComment.user_id,
        },
      });

      if (checkImageExist && checkUserExist) {
        const result = await this.prisma.tblComment.create({
          data: {
            user_id: userComment.user_id,
            image_id: userComment.image_id,
            content: userComment.content,
            comment_date: new Date(),
          },
        });

        if (result) {
          return res.status(HttpStatus.CREATED).json({
            statusCode: 200,
            message: 'Create comment successfully',
            content: result,
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Image ID or User ID do not exist',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
