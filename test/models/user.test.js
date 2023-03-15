import { jest } from "@jest/globals"; // eslint-disable-line

import User from "../../src/models/user.js";
import { validatePassword } from "../../src/utils/password.js";

describe("User database model", () => {
  test("create new user based on provided attributes", () => {
    const attrs = {
      name: "Test User",
      email: "test@example.com",
      token: "api-token",
      isActive: true,
    };

    const user = new User(attrs);

    expect(user.name).toBe(attrs.name);
    expect(user.email).toBe(attrs.email);
    expect(user.token).toBe(attrs.token);
    expect(user.isActive).toBe(attrs.isActive);
  });

  test("ignore unknown/illegal attributes on creation", () => {
    const user = new User({ bogus: 1, _id: 1 });

    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    expect(user._id).not.toBe(1);
    expect(user.bogus).toBeUndefined();
  });

  test("password gets hashed", async () => {
    const user = new User();
    await user.setPassword("secret");

    expect(user.password).not.toBe("secret");
    const result = await validatePassword("secret", user.password);
    expect(result).toBe(true);
  });

  test("token is regenerated on demand", async () => {
    const user = new User();
    const oldToken = user.token;

    await user.regenerateToken();
    expect(user.token).not.toBe(oldToken);
  });

  test("JSON omits sensitive attributes", async () => {
    const user = new User({ email: "test@example.com" });
    await user.setPassword("secret");

    const json = user.toJSON();
    expect(json.email).toBe("test@example.com");
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    expect(json._id).toBeUndefined();
    expect(json.password).toBeUndefined();
  });

  test("can authenticate with password", async () => {
    const user = new User({ email: "test@example.com" });
    await user.setPassword("secret");

    User.findOne = jest.fn(() => ({ exec: () => user }));
    user.save = jest.fn(() => user);

    const found = await User.authenticateWithPassword(
      "test@example.com",
      "secret"
    );
    expect(found).toBe(user);

    expect(User.findOne).toHaveBeenCalled();
    expect(user.lastLoginAt).not.toEqual(user.createdAt);
  });

  test("rejects incorrect passwords", async () => {
    const user = new User({ email: "test@example.com" });
    await user.setPassword("secret");

    User.findOne = jest.fn(() => ({ exec: () => user }));
    user.save = jest.fn(() => user);

    expect(user.lastLoginAt).toEqual(user.createdAt);

    const found = await User.authenticateWithPassword(
      "test@example.com",
      "incorrect"
    );
    expect(found).toBeNull();

    expect(User.findOne).toHaveBeenCalled();
  });
});
