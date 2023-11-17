import { IsNotEmpty } from "class-validator";
import { USER_AUTH_LEVEL } from "../model/user.model";


export class CreateUserDto {

  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  userLevel: USER_AUTH_LEVEL;


}

export class UpdateUserDto {
  @IsNotEmpty()
  emailAddress: string;
  @IsNotEmpty()
  level: USER_AUTH_LEVEL;

}