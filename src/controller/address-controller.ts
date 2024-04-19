import { NextFunction, Response } from "express";
import { UserRequestType } from "../type/user-request";
import { AddressCreateRequest } from "../model/address-model";
import { AddressService } from "../service/address-service";

export class AddressController {
  static async create(req: UserRequestType, res: Response, nex: NextFunction) {
    try {
      const request: AddressCreateRequest = req.body as AddressCreateRequest;
      request.contact_id = Number(req.params.contactId);
      const response = await AddressService.create(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }
}
