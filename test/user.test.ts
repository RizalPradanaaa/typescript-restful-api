import { logger } from "../src/application/logging";
import { web } from "../src/application/web";
import supertest from "supertest";

describe("POST /api/users", () => {
  it("should register if new user request invalid", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
