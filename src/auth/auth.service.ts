import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
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

  async signUp(
    email: string,
    pass_word: string,
    full_name: string,
    age: number,
    res: Response,
  ) {
    try {
      let checkUser = await this.prisma.tblUser.findFirst({
        where: {
          email: email,
        },
      });

      if (!checkUser) {
        let data = await this.prisma.tblUser.create({
          data: {
            email,
            pass_word: bcrypt.hashSync(pass_word, 10),
            full_name,
            age,
            avatar: null,
          },
        });

        return res.status(200).json({
          status: '200',
          message: 'Signup successfully',
          data,
        });
      } else {
        return res.status(404).json({
          status: '404',
          message: 'Email already existed',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

          return res.status(200).json({
            status: '200',
            message: 'Login successfully',
            data,
          });
        } else {
          return res.status(400).json({
            status: '400',
            message: 'Wrong password',
          });
        }
      } else {
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
