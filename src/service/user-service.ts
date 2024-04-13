import { PrismaClient } from "@prisma/client";
import { UserResponse, UserRequest, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";

export class UserService {
  static async register(request: UserRequest): Promise<UserResponse> {
    const registerUser = Validation.validate(UserValidation.REGISTER, request);

    const totalUsername = await PrismaClient.user.count({
      where: {
        name: registerUser.name,
      },
    });
    if (totalUsername != 0) {
      throw new ResponseError(400, "Username is already taken");
    }

    registerUser.password = await bcrypt.hash(registerUser.password, 10);

    const User = await PrismaClient.user.create({
      data: registerUser,
    });

    return toUserResponse(User);
  }
}
