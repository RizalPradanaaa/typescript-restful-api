import { User } from "@prisma/client";
import { Request } from "express";

export interface UserRequestType extends Request {
  user?: User;
}
