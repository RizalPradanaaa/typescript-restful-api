import {
  UserResponse,
  UserRequest,
  toUserResponse,
  LoginRequest,
  UpdateUserRequest,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { prismaClient } from "../application/database";
import { User } from "@prisma/client";

export class UserService {
  static async register(request: UserRequest): Promise<UserResponse> {
    const registerUser = Validation.validate(UserValidation.REGISTER, request);

    const totalUsername = await prismaClient.user.count({
      where: {
        name: registerUser.name,
      },
    });
    if (totalUsername != 0) {
      throw new ResponseError(400, "Username is already taken");
    }

    registerUser.password = await bcrypt.hash(registerUser.password, 10);

    const User = await prismaClient.user.create({
      data: registerUser,
    });

    return toUserResponse(User);
  }

  static async login(request: LoginRequest): Promise<UserResponse> {
    const loginrequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prismaClient.user.findUnique({
      where: {
        username: loginrequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, "Username or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(
      loginrequest.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(401, "Username or password is wrong");
    }

    user = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: uuid(),
      },
    });
    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);
    if (updateRequest.name) {
      user.name = updateRequest.name;
    }
    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(result);
  }
}
