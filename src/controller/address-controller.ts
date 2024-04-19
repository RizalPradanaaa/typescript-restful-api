import { NextFunction, Response } from "express";
import { UserRequestType } from "../type/user-request";
import {
  AddressCreateRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from "../model/address-model";
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

  static async get(req: UserRequestType, res: Response, nex: NextFunction) {
    const request: GetAddressRequest = {
      contact_id: Number(req.params.contactId),
      id: Number(req.params.addressId),
    };
    try {
      const response = await AddressService.get(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }

  static async update(req: UserRequestType, res: Response, next: NextFunction) {
    try {
      const request: UpdateAddressRequest = req.body as UpdateAddressRequest;
      request.contact_id = Number(req.params.contactId);
      request.id = Number(req.params.addressId);

      const response = await AddressService.update(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
