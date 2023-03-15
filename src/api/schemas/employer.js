export default {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
    name: { type: "string" },
    gender: { type: "string" },
    contactEmail: { type: "string" },
    contactNumber: { type: "string" },
  },
  required: ["email", "password", "name", "gender"],
  additionalProperties: false,
};
