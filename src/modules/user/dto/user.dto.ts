import { IsNotEmpty } from "class-validator";
import { USER_AUTH_LEVEL } from "../model/user.model";
import { Exclude, Expose } from "class-transformer";


export class CreateUserDto {
  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  level: number;
}

export class UpdateUserDto {
  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  level: USER_AUTH_LEVEL;

};

@Exclude()
export class UserProfileResponseDTO {
  @Expose()
  emailAddress: string;
  @Expose()
  authName: USER_AUTH_LEVEL;
  @Expose()
  level: number;

}

export class UserListRequestDTO {
  @IsNotEmpty()
  size: number;
  @IsNotEmpty()
  page: number;
}

export class UserListResponseDTO {

  size: number;
  page: number;
  totalPages: number;
  totalElements: number;
  data: any;
  /* 
    아이템 : UI 표시 아이템
    totalPage : (전체 아이템 개수 / 페이지 size) + 1
    currentPage : 
  */
}

export class UserProfileRequestDTO {
  @IsNotEmpty()
  emailAddress: string;
}