import { Contact, User } from "@prisma/client";
import {
  ContactCreateRequest,
  ContactResponse,
  SearchContactRequest,
  UpdateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";
import { validate } from "uuid";

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

  static async remove(user: User, id: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExist(user.username, id);
    await prismaClient.contact.delete({
      where: {
        id: contact.id,
        username: user.username,
      },
    });
    return toContactResponse(contact);
  }

  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    const searchRequest = Validation.validate(
      ContactValidation.SEARCH,
      request
    );
    const skip = (searchRequest.page - 1) * searchRequest.size;
    const filters = [];
    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
          },
          {
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }

    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }
    if (searchRequest.phone) {
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }

    const contact = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      skip: skip,
      take: searchRequest.size,
    });
    const total = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });
    return {
      data: contact.map((contact) => toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
