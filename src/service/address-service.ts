import { User } from "@prisma/client";
import {
  AddressCreateRequest,
  AddressResponse,
  toAddressResponse,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { Validation } from "../validation/validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";

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
}
