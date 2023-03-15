import {
  generatePasswordHash,
  validatePassword,
  isPasswordHash,
} from "../../src/utils/password.js";

describe("Password hash generation and validation", () => {
  const password = "secret";
  let hash;

  beforeAll(async () => {
    hash = await generatePasswordHash(password);
  });

  test("generates a valid password hash", async () => {
    expect(hash).not.toBe(password);
    expect(isPasswordHash(hash)).toBe(true);
  });

  test("hashes of different passwords differ", async () => {
    const otherPassword = "mystery";
    const otherHash = await generatePasswordHash(otherPassword);

    expect(hash).not.toEqual(otherHash);
  });

  test("hashes of same password are randomly salted", async () => {
    const otherHash = await generatePasswordHash(password);
    expect(hash).not.toEqual(otherHash);
  });

  test("correct password is validated", async () => {
    const result = await validatePassword(password, hash);
    expect(result).toBe(true);
  });

  test("incorrect password is not validated", async () => {
    const incorrectPassword = "incorrect";
    const result = await validatePassword(incorrectPassword, hash);
    expect(result).toBe(false);
  });
});
