import { NextFunction, Response, request } from "express";
import { UserRequestType } from "../type/user-request";
import {
  ContactCreateRequest,
  SearchContactRequest,
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
  static async search(req: UserRequestType, res: Response, next: NextFunction) {
    try {
      const request: SearchContactRequest = {
        name: req.query.name as string,
        email: req.query.email as string,
        phone: req.query.phone as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };
      const response = await ContactService.search(req.user!, request);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
}
