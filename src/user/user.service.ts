import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, tblUser } from '@prisma/client';
import { Response } from 'express';
import { updateUserDto, updateUserUploadDto } from './dto/user.dto';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  prisma = new PrismaClient();

  // Get user's info by token
  async getUserByToken(token: string, res: Response) {
    try {
      // lấy phần chuỗi sau Bearer trừ luôn khoảng cách (SOF)
      let payload: tblUser | any = this.jwtService.decode(token.split(' ')[1]);

      const data = await this.prisma.tblUser.findFirst({
        where: {
          user_id: payload.user_id,
        },
      });

      if (data) {
        return res.status(200).json({
          status: '200',
          message: 'Get data successfully',
          data,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'User ID does not exist',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserDetail(
    token: string,
    updateUserDto: updateUserDto,
    res: Response,
  ) {
    try {
      let payload: tblUser | any = this.jwtService.decode(token.split(' ')[1]);

      const user = await this.prisma.tblUser.findFirst({
        where: {
          user_id: payload.user_id,
        },
      });

      if (user) {
        let dataUpdate = await this.prisma.tblUser.update({
          where: {
            user_id: payload.user_id,
          },
          data: {
            ...updateUserDto,
            pass_word: bcrypt.hashSync(updateUserDto.pass_word, 10),
            age: +updateUserDto.age,
          },
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Update user successfully',
          dataUpdate,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'User ID does not exist',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async updateUserDetailUpload(
  //   token: string,
  //   updateUserUploadDto: updateUserUploadDto,
  //   avatarUrl: string,
  //   res: Response,
  // ) {
  //   try {
  //     // lấy phần chuỗi sau Bearer trừ luôn khoảng cách (SOF)
  //     let payload: tblUser | any = this.jwtService.decode(token.split(' ')[1]);

  //     let user = await this.prisma.tblUser.findFirst({
  //       where: {
  //         user_id: payload.user_id,
  //       },
  //     });

  //     if (user) {
  //       if (user.avatar) {
  //         //delete old file in server
  //         fs.unlinkSync(process.cwd() + '\\public\\avatar\\' + user.avatar);
  //       }
  //       let dataUpdate = await this.prisma.tblUser.update({
  //         where: {
  //           user_id: payload.user_id,
  //         },
  //         data: {
  //           ...updateUserUploadDto,
  //           pass_word: bcrypt.hashSync(updateUserUploadDto.pass_word, 10),
  //           age: +updateUserUploadDto.age,
  //           avatar: avatarUrl,
  //         },
  //       });

  //       return res.status(HttpStatus.OK).json({
  //         statusCode: 200,
  //         message: 'Update user upload successfully',
  //         dataUpdate,
  //       });
  //     } else {
  //       return res.status(HttpStatus.NOT_FOUND).json({
  //         statusCode: 404,
  //         message: 'User ID does not exist',
  //       });
  //     }
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async uploadAvatar(imageUrl: string, user_id: number, res: Response) {
    try {
      const user = await this.prisma.tblUser.findFirst({
        where: {
          user_id: user_id,
        },
      });

      if (user) {
        if (user.avatar) {
          //delete old file in server
          fs.unlinkSync(process.cwd() + '\\public\\avatar\\' + user.avatar);
        }

        let dataUpdate = await this.prisma.tblUser.update({
          data: { ...user, avatar: imageUrl },
          where: {
            user_id: user_id,
          },
        });

        return res.status(HttpStatus.CREATED).json({
          statusCode: 200,
          message: 'Upload avatar successfully',
          dataUpdate,
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'User ID does not exist',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
