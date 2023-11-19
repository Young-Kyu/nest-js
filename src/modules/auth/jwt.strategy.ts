import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "src/db/user/user.repository";
import { USER_AUTH_LEVEL } from "../user/model/user.model";
import { UserEntity } from "../user/user.entity";
import * as config from 'config';

@Injectable() // 다른 모듈에서도 접근할 수 있게 만들어주는 데코레이터
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      secretOrKey: config.get('jwt').secret, // jwt secret key
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // header의 Bearer type을 사용한다는 선언
    })
  }

  // 상위 contructor에서 우선 토큰이 유효한지 확인되면 자동으로 실행되는 메소드
  // payload는 jwt 토큰 
  async validate(payload: { role: USER_AUTH_LEVEL, emailAddress: string }) {
    const { emailAddress, role } = payload;

    const user: UserEntity = await this.userRepository.getUserByEmail(emailAddress);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

}