import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/user.js");

describe("/api/v1/auth/login", () => {
  const user = { email: "test@example.com" };

  test("login with correct email and password succeeds", async () => {
    UserService.authenticateWithPassword = jest.fn().mockResolvedValue(user);

    const req = supertest(app);
    const res = await req
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "secret" });

    expect(UserService.authenticateWithPassword).toHaveBeenCalledWith(
      "test@example.com",
      "secret"
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.user).toEqual(user);
  });

  test("login without parameters fails", async () => {
    const req = supertest(app);
    const res = await req.post("/api/v1/auth/login");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("cannot be a GET request", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/auth/login");
    expect(res.status).toBe(405);
    expect(res.body).toHaveProperty("error");
  });

  test("login with incorrect email and password fails", async () => {
    UserService.authenticateWithPassword = jest.fn().mockResolvedValue(null);

    const req = supertest(app);
    const res = await req
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "secret" });

    expect(UserService.authenticateWithPassword).toHaveBeenCalledWith(
      "test@example.com",
      "secret"
    );
    expect(res.status).toBe(401);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("error");
  });
});

describe("/api/v1/auth/logout", () => {
  test("resets the token", async () => {
    const user = { email: "test@example.com" };
    UserService.regenerateToken = jest.fn().mockResolvedValue(user);
    UserService.authenticateWithToken = jest.fn().mockResolvedValue(user);

    const req = supertest(app);
    const res = await req
      .post("/api/v1/auth/logout")
      .set("Authorization", "Token abc");

    expect(res.status).toBe(204);
    expect(UserService.authenticateWithToken).toHaveBeenCalledWith("abc");
    expect(UserService.regenerateToken).toHaveBeenCalled();
  });

  test("cannot be called by anonymous user", async () => {
    const req = supertest(app);
    const res = await req.post("/api/v1/auth/logout");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("cannot be a GET request", async () => {
    const user = { email: "test@example.com" };
    UserService.authenticateWithToken = jest.fn().mockResolvedValue(user);

    const req = supertest(app);
    const res = await req
      .get("/api/v1/auth/logout")
      .set("Authorization", "Token abc");

    expect(res.status).toBe(405);
    expect(res.body).toHaveProperty("error");
  });
});

describe("/api/v1/auth/password", () => {
  test("can change password", async () => {
    const user = { email: "test@example.com" };
    UserService.authenticateWithToken = jest.fn().mockResolvedValue(user);
    UserService.setPassword = jest.fn().mockResolvedValue(user);

    const req = supertest(app);
    const res = await req
      .post("/api/v1/auth/password")
      .set("Authorization", "Token abc")
      .send({ password: "secret" });

    expect(res.status).toBe(204);
    expect(res.body).not.toHaveProperty("password");
    expect(UserService.setPassword).toHaveBeenCalledWith(user, "secret");
  });
});

describe("/api/v1/auth/register", () => {
  test("new user can register", async () => {
    UserService.createUser = jest
      .fn()
      .mockReturnValue({ email: "test@example.com" });

    const req = supertest(app);
    const res = await req
      .post("/api/v1/auth/register")
      .send({ email: "test@example.com", password: "secret" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user.email", "test@example.com");
    expect(res.body).not.toHaveProperty("user.password");
    expect(UserService.createUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "secret",
    });
  });
});
