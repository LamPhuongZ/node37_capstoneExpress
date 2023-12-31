import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { SaveImageModule } from './save_image/save_image.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    CommentModule,
    AuthModule,
    ImageModule,
    SaveImageModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true })
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
