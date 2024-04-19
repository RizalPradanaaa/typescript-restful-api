import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to create contact", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "Rizal Nawang",
        last_name: "Pradana",
        email: "rizal@example.com",
        phone: "085XXXXX",
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe("Rizal Nawang");
    expect(response.body.data.last_name).toBe("Pradana");
    expect(response.body.data.email).toBe("rizal@example.com");
    expect(response.body.data.phone).toBe("085XXXXX");
  });

  it("should reject create contact if request not valid", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });
  it("should be able to get contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    // logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.first_name).toBe(contact.first_name);
    expect(response.body.data.last_name).toBe(contact.last_name);
    expect(response.body.data.email).toBe(contact.email);
    expect(response.body.data.phone).toBe(contact.phone);
  });

  it("should reject get contact if id not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id} + 1`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to update contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "Rizal",
        last_name: "Pradana",
        email: "rizal@example.com",
        phone: "085XXXXX",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.first_name).toBe("Rizal");
    expect(response.body.data.last_name).toBe("Pradana");
    expect(response.body.data.email).toBe("rizal@example.com");
    expect(response.body.data.phone).toBe("085XXXXX");
  });

  it("should reject update contact invalid request", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to delete contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");
    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });

  it("should reject delete contact id not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id} + 1`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to search contact", async () => {
    const response = await supertest(web)
      .get(`/api/contacts`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able search using name", async () => {
    const response = await supertest(web)
      .get(`/api/contacts`)
      .query({
        name: "es",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able search using email", async () => {
    const response = await supertest(web)
      .get(`/api/contacts`)
      .query({
        email: "test",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able search using phone", async () => {
    const response = await supertest(web)
      .get(`/api/contacts`)
      .query({
        phone: "test",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able search no result", async () => {
    const response = await supertest(web)
      .get(`/api/contacts`)
      .query({
        name: "wrong",
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(0);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able search with paging", async () => {
    const response = await supertest(web)
      .get(`/api/contacts`)
      .query({
        page: 2,
        size: 1,
      })
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.current_page).toBe(2);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(1);
  });
});
