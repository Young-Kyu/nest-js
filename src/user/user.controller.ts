import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";


@Controller()
export class UserController {

  constructor(private readonly userService: UserService) { };

  @Get('api/user')
  async user() {
    return { name: '이지롱~~' }
  }

}