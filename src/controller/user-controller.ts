import { NextFunction, Request, Response } from "express";
import {
  LoginRequest,
  UpdateUserRequest,
  UserRequest,
} from "../model/user-model";
import { UserService } from "../service/user-service";
import { UserRequestType } from "../type/user-request";

export class UserController {
  static async register(req: Request, res: Response, nex: NextFunction) {
    try {
      const request: UserRequest = req.body as UserRequest;
      const response = await UserService.register(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }
  static async login(req: Request, res: Response, nex: NextFunction) {
    try {
      const request: LoginRequest = req.body as LoginRequest;
      const response = await UserService.login(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }
  static async get(req: UserRequestType, res: Response, nex: NextFunction) {
    try {
      const response = await UserService.get(req.user!);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }

  static async update(req: UserRequestType, res: Response, nex: NextFunction) {
    try {
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const response = await UserService.update(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }
}
