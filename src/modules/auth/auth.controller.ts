import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/user.dto';
import { USER_AUTH_LEVEL } from '../user/model/user.model';
import { JwtService } from '@nestjs/jwt';
import { isPublic } from 'src/config/guards/global.guard';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { };

  @Get('google')
  @isPublic()
  googleLogin() {
    const googleLoginUrl =
      'https://accounts.google.com/o/oauth2/auth?' +
      'response_type=code&' +
      'redirect_uri=http://localhost:8080/auth/google/callback&' +
      'scope=openid%20profile%20email&' +
      'client_id=' + `${'92869307368-60cp5dm541orgrg3vregapoflutl50kq.apps.googleusercontent.com'}`
      ;
    return { url: googleLoginUrl };
  }

  @isPublic()
  @Get('google/callback')
  async googleLoginCallback(@Req() req, @Res() res) {
    const code = req.query.code;

    const idToken = await this.authService.getGoogleIdToken(code);

    const { email } = await this.authService.verifyGoogleIdToken(idToken);

    let user = await this.userService.getUserByEmail(email);

    let level = USER_AUTH_LEVEL.MEMBER;
    if (!user) {
      const isFirstMember = await this.userService.getUserAndCount(email);
      level = isFirstMember > 0 ? USER_AUTH_LEVEL.MEMBER : USER_AUTH_LEVEL.SUPER_ADMIN;
      const userLevel = await this.authService.getAuthInfo(level);
      const createUserDto = new CreateUserDto();
      createUserDto.emailAddress = email;
      createUserDto.level = userLevel.level;
      user = await this.userService.createUser(createUserDto);
    }

    const token = this.authService.generateJwtToken(user.emailAddress, level);

    res.redirect(`http://localhost:3000?userToken=${token}`);

  }

  @Get('test')
  @isPublic()
  async test() {
    const token = this.authService.generateJwtToken('qsc335@gmail.com', USER_AUTH_LEVEL.ADMIN);
    return token;
  }

}
