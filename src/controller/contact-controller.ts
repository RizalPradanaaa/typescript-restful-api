import { NextFunction, Response, request } from "express";
import { UserRequestType } from "../type/user-request";
import {
  ContactCreateRequest,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactService } from "../service/contact-service";

export class ContactController {
  static async create(req: UserRequestType, res: Response, nex: NextFunction) {
    try {
      const request: ContactCreateRequest = req.body as ContactCreateRequest;
      const response = await ContactService.create(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }

  static async get(req: UserRequestType, res: Response, nex: NextFunction) {
    try {
      const id = Number(req.params.contactId);
      const response = await ContactService.get(req.user!, id);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }

  static async update(req: UserRequestType, res: Response, nex: NextFunction) {
    try {
      const request: UpdateContactRequest = req.body as UpdateContactRequest;
      request.id = Number(req.params.contactId);
      const response = await ContactService.update(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      nex(e);
    }
  }
  static async remove(req: UserRequestType, res: Response, nex: NextFunction) {
    const contactId = Number(req.params.contactId);
    const response = await ContactService.remove(req.user!, contactId);
    res.status(200).json({
      data: "OK",
    });
    try {
    } catch (e) {
      nex(e);
    }
  }
}
