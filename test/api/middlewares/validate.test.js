import { jest } from "@jest/globals"; // eslint-disable-line

import { requireSchema } from "../../../src/api/middlewares/validate.js";

const mockResponse = () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  return res;
};

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    age: { type: "number" },
    shoeSize: { type: "integer" },
    createdAt: { type: "string", format: "date-time" },
    website: { type: "string", format: "uri" },
  },
  required: ["email"],
  additionalProperties: false,
};

describe("JSONSchema validator middleware", () => {
  test("validates body based on provided schema", () => {
    const req = { body: { name: "Jane Doe", email: "test@example.com" } };
    const res = {};

    const validator = requireSchema(schema);
    validator(req, res, (err) => {
      expect(err).toBeFalsy();
    });

    expect(req.validatedBody).toEqual(req.body);
  });

  test("requires body to be present", () => {
    const req = { body: {} };
    const res = mockResponse();
    const next = jest.fn();

    const validator = requireSchema(schema);
    validator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0]).toHaveProperty("error");
    expect(next).not.toHaveBeenCalled();
  });

  test("missing required attribute fails validation", () => {
    const req = { body: {} };
    const res = mockResponse();
    const next = jest.fn();

    const validator = requireSchema(schema);
    validator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0]).toHaveProperty("error");
    expect(next).not.toHaveBeenCalled();
  });
});
