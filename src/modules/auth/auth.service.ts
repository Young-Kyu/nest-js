import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { GoogleValidtionResponseDTO } from './model/auth.model';
import { JwtService } from '@nestjs/jwt';
import { USER_AUTH_LEVEL } from '../user/model/user.model';
import * as config from 'config';
import { AuthEntity } from '../../entities/auth/auth.entity';
import { AuthRepository } from 'src/modules/auth/auth.repository';
@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository
  ) { };

  async getGoogleIdToken(code: string): Promise<string> {
    try {
      const { clientId, clientSecret, redirectUrl, grantType } = config.get('google');

      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl,
        grant_type: grantType
      });
      const idToken: string = data.id_token;
      return idToken;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async verifyGoogleIdToken(idToken: string): Promise<GoogleValidtionResponseDTO> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`
      );
      const userInfo: GoogleValidtionResponseDTO = response.data;

      return userInfo;
    } catch (err) {
      throw new BadRequestException();
    }
  };

  generateJwtToken(emailAddress: string, role: USER_AUTH_LEVEL) {
    return this.jwtService.sign({
      emailAddress,
      role
    });
  }

  async getAuthInfo(level: USER_AUTH_LEVEL): Promise<AuthEntity> {
    return this.authRepository.getLevelInfo(level);
  }


}
