import { Body, Controller, Get, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserStatusValidtionPipe } from "src/pipes/user-status-validtion.pipe";
import { CreateUserDto, UserAuthUpdateRequestDTO, UserListRequestDTO, UserProfileRequestDTO, UserProfileResponseDTO } from "./dto/user.dto";
import { UserEntity } from "../../entities/user/user.entity";
import { UserService } from "./user.service";
import { isPublic } from "src/config/guards/global.guard";
import { getUser } from "src/config/user.decorator";


@UsePipes(ValidationPipe)
@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { };

  @Get('my')
  async getUserInfo(@getUser() requestUser: UserProfileRequestDTO): Promise<UserProfileResponseDTO> {
    const userInfo = await this.userService.getUserByEmail(requestUser.emailAddress)
    const response = new UserProfileResponseDTO();
    response.emailAddress = userInfo.emailAddress;
    response.level = userInfo.userLevel;
    response.authName = userInfo.auth.authName;
    return response;
  }

  @Post()
  @UsePipes(ValidationPipe) // CreateUserDto에 정의된 validation을 적용, ValidationPipe : nest에서 기본으로 제공하는 유효성 체크 하는 기능
  async createUser(
    @Body() body: CreateUserDto
  ): Promise<UserEntity> {
    const createUserDto = new CreateUserDto();
    createUserDto.emailAddress = body.emailAddress;
    createUserDto.level = body.level;
    return await this.userService.createUser(createUserDto);
  }

  @Get('list')
  async getUserList(
    @Query() request: UserListRequestDTO
  ) {
    const result = this.userService.getUserList(request)
    return result;
  }

  @Patch('auth')
  async updateUserAuth(@getUser() requestUser: UserEntity, @Body(UserStatusValidtionPipe) body: UserAuthUpdateRequestDTO) {
    return this.userService.updateUserAuth(requestUser, body);
  }

  @Post('tt')
  @isPublic()
  async createUser2(
    @Body() body: { emailAddress: string; level: number }
  ): Promise<boolean> {
    for (let i = 7; i < 33; i++) {
      await this.userService.createUser({
        emailAddress: `test${i}@test.com`,
        level: 3,
        userId: `test${i}`
      });
    }
    return true;
  }
  // @Patch('level')
  // async updateUserLevel(
  //   @Body(UserStatusValidtionPipe) request: UpdateUserDto // 변수 부분 interceptor 구현(Pipe)
  // ) {
  //   return this.userService.updateUser(request);
  // }
}