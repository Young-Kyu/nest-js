import { ArgumentMetadata, BadRequestException, NotFoundException, PipeTransform } from "@nestjs/common";
import { UpdateUserDto } from "src/modules/user/dto/user.dto";
import { USER_AUTH_LEVEL } from "src/modules/user/model/user.model";

/* custom Pipe */
export class UserStatusValidtionPipe implements PipeTransform {

  transform(value: UpdateUserDto, metadata: ArgumentMetadata) {
    if (!(value.level in USER_AUTH_LEVEL)) {
      throw new BadRequestException(`${value} is not valid option`); // default Exception
    }

    return value;
  }
}