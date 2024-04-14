import { User } from "@prisma/client";
import {
  ContactCreateRequest,
  ContactResponse,
  toContactResponse,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";

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
}
