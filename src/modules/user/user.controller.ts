import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserStatusValidtionPipe } from "src/pipes/user-status-validtion.pipe";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { USER_AUTH_LEVEL } from "./model/user.model";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";


@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { };

  @Get('all')
  async getAllUser(): Promise<UserEntity[]> {
    const result = this.userService.getAllUser();
    return result;
  }

  @Get('/:email')
  async user(@Param('email') emailAddress: string): Promise<UserEntity> {
    // async user(@query('email') emailAddress: string): Promise<UserEntity> {
    const result = this.userService.getUserByEmail(emailAddress);

    return result;
  }
  @Post()
  @UsePipes(ValidationPipe) // CreateUserDto에 정의된 validation을 적용, ValidationPipe : nest에서 기본으로 제공하는 유효성 체크 하는 기능
  async createUser(
    @Body() body: CreateUserDto
  ): Promise<UserEntity> {
    return await this.userService.createUser(body);
  }

  // @Patch('/:userId/level')
  @Patch('/level')
  async updateUserLevel(
    // @Param('userId') userEmail: string,
    @Body(UserStatusValidtionPipe) request: UpdateUserDto // 변수 부분 interceptor 구현(Pipe)
  ) {
    console.log(typeof request);
    console.log(request);
    return this.userService.updateUser(request);
  }

}