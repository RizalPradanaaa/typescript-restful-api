import { Contact, User } from "@prisma/client";
import {
  ContactCreateRequest,
  ContactResponse,
  UpdateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class ContactService {
  static async create(
    user: User,
    request: ContactCreateRequest
  ): Promise<ContactResponse> {
    const contactRequests = await Validation.validate(
      ContactValidation.CREATE,
      request
    );

    const record = {
      ...contactRequests,
      ...{ username: user.username },
    };

    const contact = await prismaClient.contact.create({ data: record });
    return toContactResponse(contact);
  }

  static async checkContactMustExist(
    username: string,
    id: number
  ): Promise<Contact> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: username,
        id: id,
      },
    });
    if (!contact) {
      throw new ResponseError(404, "Contact is not found");
    }
    return contact;
  }
  static async get(user: User, id: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExist(user.username, id);
    return toContactResponse(contact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateRequest = await Validation.validate(
      ContactValidation.UPDATE,
      request
    );
    await this.checkContactMustExist(user.username, updateRequest.id);
    const contact = await prismaClient.contact.update({
      where: {
        id: updateRequest.id,
        username: user.username,
      },
      data: updateRequest,
    });
    return toContactResponse(contact);
  }
}
