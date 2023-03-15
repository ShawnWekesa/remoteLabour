import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import ApplicationService from "../../../src/services/application.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/application.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/application/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/application");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    ApplicationService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/application")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(ApplicationService.list).toHaveBeenCalled();
  });

  test("POST creates a new Application", async () => {
    const data = {
      recruiterId: "614c2c2a29d7763052c63810",
      jobId: "614c2c2a29d7763052c63810",
      status: "test",
      dateOfApplication: "2001-01-01T00:00:00Z",
      dateofJoining: "2001-01-01T00:00:00Z",
      sop: "test",
    };

    ApplicationService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/application")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(ApplicationService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Application without required attributes fails", async () => {
    const data = {};

    ApplicationService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/application")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(ApplicationService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/application/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    ApplicationService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/application/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(ApplicationService.get).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/application/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "507f1f77bcf86cd799439011";
    ApplicationService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/application/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(ApplicationService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    ApplicationService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/application/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(ApplicationService.get).not.toHaveBeenCalled();
  });

  test("Application update", async () => {
    const data = {
      recruiterId: "614c2c2a29d7763052c63810",
      jobId: "614c2c2a29d7763052c63810",
    };
    ApplicationService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/application/507f1f77bcf86cd799439011`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(ApplicationService.update).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      data
    );
  });

  test("Application deletion", async () => {
    ApplicationService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/application/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(ApplicationService.delete).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });
});
