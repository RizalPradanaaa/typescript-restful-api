import { Address, User } from "@prisma/client";
import {
  AddressCreateRequest,
  AddressResponse,
  GetAddressRequest,
  toAddressResponse,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { Validation } from "../validation/validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { validate } from "uuid";
import { ResponseError } from "../error/response-error";

export class AddressService {
  static async create(
    user: User,
    request: AddressCreateRequest
  ): Promise<AddressResponse> {
    const createRequest = Validation.validate(
      AddressValidation.CREATE,
      request
    );

    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id
    );

    const address = await prismaClient.address.create({
      data: createRequest,
    });

    return toAddressResponse(address);
  }

  static async checkAddressMustExist(
    contactId: number,
    addressId: number
  ): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });
    if (!address) {
      throw new ResponseError(404, "Address is not found");
    }
    return address;
  }
  static async get(
    user: User,
    req: GetAddressRequest
  ): Promise<AddressResponse> {
    const request = Validation.validate(AddressValidation.GET, req);
    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id
    );
    const address = await this.checkAddressMustExist(
      request.contact_id,
      request.id
    );
    return toAddressResponse(address);
  }
}
