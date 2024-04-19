import { Address, User } from "@prisma/client";
import {
  AddressCreateRequest,
  AddressResponse,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
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
  static async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    const updateRequest = Validation.validate(
      AddressValidation.UPDATE,
      request
    );
    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id
    );
    await this.checkAddressMustExist(
      updateRequest.contact_id,
      updateRequest.id
    );

    const address = await prismaClient.address.update({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id,
      },
      data: updateRequest,
    });

    return toAddressResponse(address);
  }
  static async remove(
    user: User,
    request: RemoveAddressRequest
  ): Promise<AddressResponse> {
    const removeRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id
    );
    await this.checkAddressMustExist(
      removeRequest.contact_id,
      removeRequest.id
    );

    const address = await prismaClient.address.delete({
      where: {
        id: removeRequest.id,
      },
    });

    return toAddressResponse(address);
  }

  static async list(
    user: User,
    contactId: number
  ): Promise<Array<AddressResponse>> {
    await ContactService.checkContactMustExist(user.username, contactId);

    const addresses = await prismaClient.address.findMany({
      where: {
        contact_id: contactId,
      },
    });

    return addresses.map((address) => toAddressResponse(address));
  }
}
