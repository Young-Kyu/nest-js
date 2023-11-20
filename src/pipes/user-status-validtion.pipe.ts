import { ArgumentMetadata, BadRequestException, NotFoundException, PipeTransform } from "@nestjs/common";
import { UserAuthUpdateRequestDTO } from "src/modules/user/dto/user.dto";
import { USER_AUTH_LEVEL } from "src/modules/user/model/user.model";

/* custom Pipe */
export class UserStatusValidtionPipe implements PipeTransform {

  transform(value: UserAuthUpdateRequestDTO, metadata: ArgumentMetadata) {
    if (!(value.updateAuth in USER_AUTH_LEVEL)) {
      throw new BadRequestException(`${value.updateAuth} is not valid option`); // default Exception
    }

    return value;
  }
}