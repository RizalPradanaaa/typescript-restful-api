import { ZodType, z } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(25),
    password: z.string().min(3).max(25),
    name: z.string().min(3).max(25),
  });
}
