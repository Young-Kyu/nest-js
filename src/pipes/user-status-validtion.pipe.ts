import { ArgumentMetadata, BadRequestException, NotFoundException, PipeTransform } from "@nestjs/common";
import { UserAuthUpdateRequestDTO } from "../modules/user/dto/user.dto";
import { USER_AUTH_LEVEL } from "src/constants/auth";

/* custom Pipe */
export class UserStatusValidtionPipe implements PipeTransform {

  transform(value: UserAuthUpdateRequestDTO, metadata: ArgumentMetadata) {
    if (!(value.updateAuth in USER_AUTH_LEVEL)) {
      throw new BadRequestException(`${value.updateAuth} is not valid option`); // default Exception
    }

    return value;
  }
}