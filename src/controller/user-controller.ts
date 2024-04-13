import { NextFunction, Request, Response } from "express";
import { LoginRequest, UserRequest } from "../model/user-model";
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
}
