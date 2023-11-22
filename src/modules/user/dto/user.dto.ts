import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { USER_AUTH_LEVEL } from "../model/user.model";
import { Exclude, Expose } from "class-transformer";


export class CreateUserDto {
  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  level: number;

  @IsNotEmpty()
  userId: string;
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
  size: number;
  page: number;
  search?: string;
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
  @IsString()
  emailAddress: string;
}

export class UserAuthUpdateRequestDTO {
  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  updateAuth: USER_AUTH_LEVEL;
}

export class UserAuditHistoryRequestDTO {

  @IsNotEmpty()
  @IsString()
  userId: string;

  size: number;
  page: number;
}