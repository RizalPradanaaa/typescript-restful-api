import { User } from "@prisma/client";

export type UserResponse = {
  username: string;
  name: string;
  token?: string;
};

export type UserRequest = {
  username: string;
  password: string;
  name: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type UpdateUserRequest = {
  name?: string;
  password?: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    name: user.name,
    username: user.username,
  };
}
