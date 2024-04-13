import { ZodType, z } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(25),
    password: z.string().min(3).max(25),
    name: z.string().min(3).max(25),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(3).max(25),
    password: z.string().min(3).max(25),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3).max(25).optional(),
    password: z.string().min(3).max(25).optional(),
  });
}
