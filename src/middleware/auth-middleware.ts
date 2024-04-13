import { NextFunction, Response } from "express";
import { prismaClient } from "../application/database";
import { UserRequestType } from "../type/user-request";

export const authMiddleware = async (
  req: UserRequestType,
  res: Response,
  nex: NextFunction
) => {
  const token = req.get("X-API-TOKEN");
  if (token) {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (user) {
      req.user = user;
      nex();
      return;
    }
  }
  res
    .status(401)
    .json({
      error: "Unauthorized",
    })
    .end();
};
