import { BadGatewayException, Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { isPublic } from '../../config/guards/global.guard';
import * as config from 'config';
import { ERROR_MESSAGE } from '../../constants/error';
import { v4 as uuidv4 } from 'uuid';
import { USER_AUTH_LEVEL } from 'src/constants/auth';
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
      'client_id=' + `${config.get('google').clientId}`
      ;
    return { url: googleLoginUrl };
  }

  @isPublic()
  @Get('google/callback')
  async googleLoginCallback(@Req() req, @Res() res) {
    const code = req.query.code;
    if (!code) {
      throw new BadGatewayException(ERROR_MESSAGE.GOOGLE_BAD_GATEWAY);
    }
    const idToken = await this.authService.getGoogleIdToken(code);

    const { email } = await this.authService.verifyGoogleIdToken(idToken);

    let user = await this.userService.getUserByEmail(email);
    let level = USER_AUTH_LEVEL.MEMBER;

    if (!user) {
      const isFirstMember = await this.userService.getUserCount();
      level = isFirstMember > 0 ? USER_AUTH_LEVEL.MEMBER : USER_AUTH_LEVEL.SUPER_ADMIN;
      const userLevel = await this.authService.getAuthInfo(level);
      const userId = uuidv4();
      const createUserDto = new CreateUserDto();
      createUserDto.emailAddress = email;
      createUserDto.level = userLevel.level;
      createUserDto.userId = userId;
      user = await this.userService.createUser(createUserDto);
    }

    this.userService.updateUserLoginDate(user);

    const token = this.authService.generateJwtToken(user.emailAddress, user.userId, level);

    res.redirect(`http://localhost:3000?userToken=${token}`);

  }
}
