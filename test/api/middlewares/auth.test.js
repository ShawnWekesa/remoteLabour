import { jest } from "@jest/globals"; // eslint-disable-line

import {
  authenticateWithToken,
  requireUser,
} from "../../../src/api/middlewares/auth.js";

import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/user.js");

const mockResponse = () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  return res;
};

describe("Authenticating with token", () => {
  test("valid API token is recognized (Token keyword)", async () => {
    const req = {
      get: jest.fn().mockReturnValue("token abc"),
    };
    const res = {};
    const next = jest.fn();
    const user = { email: "test@example.com" };

    UserService.authenticateWithToken = jest.fn().mockResolvedValue(user);

    await authenticateWithToken(req, res, next);

    expect(UserService.authenticateWithToken).toHaveBeenCalledWith("abc");
    expect(req.user).toBe(user);
  });

  test("valid API token is recognized (Bearer keyword)", async () => {
    const req = {
      get: jest.fn().mockReturnValue("bearer abc"),
    };
    const res = {};
    const next = jest.fn();
    const user = { email: "test@example.com" };

    UserService.authenticateWithToken = jest.fn().mockResolvedValue(user);

    await authenticateWithToken(req, res, next);

    expect(UserService.authenticateWithToken).toHaveBeenCalledWith("abc");
    expect(req.user).toBe(user);
  });
});

describe("Requiring an authenticated user", () => {
  test("allows authenticated user", () => {
    const req = { user: { email: "test@example.com" } };
    const res = {};
    const next = jest.fn();

    requireUser(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  test("blocks anonymous user", () => {
    const req = { user: null };
    const res = mockResponse();
    const next = jest.fn();

    requireUser(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
