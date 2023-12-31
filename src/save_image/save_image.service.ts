import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, tblUser } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class SaveImageService {
  constructor(private jwtService: JwtService) {}

  prisma = new PrismaClient();

  // Check whether the image is saved or not
  async checkImage(image_id: number, res: Response) {
    try {
      let checkImg = await this.prisma.tblImage.findFirst({
        where: {
          image_id,
        },
      });

      if (checkImg) {
        let checkSave = await this.prisma.tblSaveImage.findFirst({
          where: {
            image_id,
          },
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Saved!',
          content: checkSave,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'This image does not exist!',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get saved images list by user_id
  async getSavedImageList(token: string, res: Response) {
    try {
      // lấy phần chuỗi sau Bearer trừ luôn khoảng cách (SOF)
      let payload: tblUser | any = this.jwtService.decode(token.split(' ')[1]);

      let checkUser = await this.prisma.tblSaveImage.findMany({
        where: {
          user_id: payload.user_id,
        },
        include: {
          tblImage: true,
        },
      });

      if (checkUser) {
        if (checkUser.length === 0) {
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: 406,
            message: "This user hasn't saved any images yet!",
          });
        } else {
          return res.status(HttpStatus.OK).json({
            statusCode: 200,
            message: 'Get data successfully',
            content: checkUser,
          });
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
