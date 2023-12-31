import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, tblUser } from '@prisma/client';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { updateUserDto } from './dto/user.dto';

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

  // Update user's profile
  async updateUser(token: string, updateUser: updateUserDto, file: Express.Multer.File) {
    try {
      // lấy phần chuỗi sau Bearer trừ luôn khoảng cách (SOF)
      let payload: tblUser | any = this.jwtService.decode(token.split(' ')[1]);

      const newData = {
        email: updateUser.email,
        full_name: updateUser.full_name,
        age: Number(updateUser.age),
        pass_word: bcrypt.hashSync(updateUser.pass_word, 10),
        avatar: file.filename,
      };

      await this.prisma.tblUser.update({
        where: {
          user_id: payload.user_id,
        },
        data: {
          ...newData,
        },
      });

      return 'Update user successfully';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
