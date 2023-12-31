import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { createUserDto } from 'src/user/dto/user.dto';
// import { responseData } from '../config/Response.js';
import * as bcrypt from 'bcrypt';
import { authDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  prisma = new PrismaClient();

  // can xem lai
  async signUp(userSignUp: createUserDto, res: Response) {
    // try {
      let checkUser = await this.prisma.tblUser.findFirst({
        where: {
          email: userSignUp.email,
        },
      });

      // if (!checkUser) {
        let data = await this.prisma.tblUser.create({
          data: {
            email: checkUser.email,
            pass_word: bcrypt.hashSync(checkUser.pass_word, 10),
            full_name: checkUser.full_name,
            age: checkUser.age,
            avatar: null,
          },
        });

        console.log(data);
        

        // return responseData(res, 'Signup successfully', data, 200);
      //   return res.status(200).json({
      //     status: '200',
      //     message: 'Signup successfully',
      //   });

      // } else {
      //   // return responseData(res, 'Email already existed', '', 404);

      //   return res.status(404).json({
      //     status: '404',
      //     message: 'Email already existed',
      //   });
      // }
    // } catch (error) {
    //   throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }

  async login(userLogin: authDto, res: Response) {
    try {
      let checkUser = await this.prisma.tblUser.findFirst({
        where: {
          email: userLogin.email,
        },
      });

      if (checkUser) {
        if (
          bcrypt.compareSync(userLogin.pass_word, checkUser.pass_word) ||
          userLogin.pass_word === checkUser.pass_word
        ) {
          checkUser = { ...checkUser, pass_word: '' };

          let token = await this.jwtService.signAsync(checkUser, {
            secret: this.configService.get('KEY'),
            expiresIn: '1d',
          });

          const data = { user: checkUser, token: token };

          // return responseData(res, 'Login successfully', data, 200);

          return res.status(200).json({
            status: '200',
            data,
            message: 'Login successfully',
          });

        } else {
          // return responseData(res, 'Wrong password', '', 400);
          return res.status(400).json({
            status: '400',
            message: 'Wrong password',
          });
        }
      } else {
        // return responseData(res, 'User not found', '', 404);

        return res.status(404).json({
          status: '404',
          message: 'User not found',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
