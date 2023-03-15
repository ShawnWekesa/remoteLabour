import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import EmployerService from "../../../src/services/employer.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/employer.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/employer/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/employer");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    EmployerService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/employer")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(EmployerService.list).toHaveBeenCalled();
  });

  test("POST creates a new Employer", async () => {
    const data = {
      email: "test@example.com",
      password: "test",
      name: "test",
      gender: "test",
      contactEmail: "test",
      contactNumber: "test",
    };

    EmployerService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/employer")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(EmployerService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Employer without required attributes fails", async () => {
    const data = {};

    EmployerService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/employer")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(EmployerService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/employer/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    EmployerService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/employer/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(EmployerService.get).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/employer/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "507f1f77bcf86cd799439011";
    EmployerService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/employer/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(EmployerService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    EmployerService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/employer/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(EmployerService.get).not.toHaveBeenCalled();
  });

  test("Employer update", async () => {
    const data = {
      email: "test@example.com",
      password: "test",
      name: "test",
      gender: "test",
    };
    EmployerService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/employer/507f1f77bcf86cd799439011`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(EmployerService.update).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      data
    );
  });

  test("Employer deletion", async () => {
    EmployerService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/employer/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(EmployerService.delete).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });
});
