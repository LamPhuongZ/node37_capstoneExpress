import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, tblUser } from '@prisma/client';
import { Response } from 'express';
import * as fs from 'fs';
import { createImageDto } from './dto/image.dto';

@Injectable()
export class ImageService {
  constructor(private jwtService: JwtService) {}

  prisma = new PrismaClient();

  // Get images list
  async getImageList(res: Response) {
    try {
      let image = await this.prisma.tblImage.findMany();

      if (image.length > 0) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get data successfully',
          content: image,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'The image list is empty',
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get image by image_name
  async getImageByName(image_name: string, res: Response) {
    try {
      // Find image by name
      let imageByName = await this.prisma.tblImage.findMany({
        where: {
          image_name: {
            contains: image_name,
          },
        },
      });

      // Check image if exists
      if (imageByName.length > 0) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get data successfully',
          content: imageByName,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Image name not found!',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get image's info and its creator by image_id
  async getInfoByImageId(image_id: number, res: Response) {
    try {
      let info = await this.prisma.tblImage.findFirst({
        include: {
          tblUser: true,
        },
        where: {
          image_id: image_id,
        },
      });

      if (info) {
        const {
          tblUser: { pass_word, ...userInfo },
          ...imageInfo
        } = info;
        const updatedInfo = { ...imageInfo, tblUser: userInfo };

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get data successfully',
          content: updatedInfo,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Image ID not found!',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get created images list by user_id
  async getCreatedImageList(token: string, res: Response) {
    try {
      // lấy phần chuỗi sau Bearer trừ luôn khoảng cách (SOF)
      let payload: tblUser | any = this.jwtService.decode(token.split(' ')[1]);

      let checkUser = await this.prisma.tblImage.findMany({
        where: {
          user_id: payload.user_id,
        },
      });

      if (checkUser) {
        if (checkUser.length === 0) {
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: 406,
            message: "This user hasn't created any image yet!",
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

  // Delete created image by image_id
  async removeCreatedImage(image_id: number, token: string, res: Response) {
    try {
      // lấy phần chuỗi sau Bearer trừ luôn khoảng cách (SOF)
      let payload: tblUser | any = this.jwtService.decode(token.split(' ')[1]);

      let checkComment = await this.prisma.tblComment.deleteMany({
        where: {
          image_id,
        },
      });

      let checkSavedImage = await this.prisma.tblSaveImage.deleteMany({
        where: {
          image_id,
          user_id: payload.user_id,
        },
      });

      let imageId = await this.prisma.tblImage.deleteMany({
        where: {
          image_id,
          user_id: payload.user_id,
        },
      });

      if (imageId.count !== 0) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Delete image successfully',
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Image ID does not exist',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Upload new image
  async uploadImage(
    createImageDto: createImageDto,
    url: string,
    token: string,
    res: Response,
  ) {
    const { image_name, description } = createImageDto;

    try {
      // lấy phần chuỗi sau Bearer trừ luôn khoảng cách (SOF)
      let payload: tblUser | any = this.jwtService.decode(token.split(' ')[1]);

      let dataUpload = await this.prisma.tblImage.create({
        data: {
          image_name: createImageDto.image_name,
          url: url,
          description: createImageDto.description,
          user_id: payload.user_id,
        },
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Create image successfully',
        dataUpload,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
