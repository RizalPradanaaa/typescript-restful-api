import { logger } from "../src/application/logging";
import { web } from "../src/application/web";
import supertest from "supertest";
import { UserTest } from "./user-util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

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

  it("should register if new user request valid", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test",
    });
    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to login", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "test",
    });
    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.token).toBeDefined();
  });

  it("should reject login if username wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "wrong",
      password: "test",
    });
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
  });

  it("should reject login if password wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "wrong",
    });
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
  });
});
