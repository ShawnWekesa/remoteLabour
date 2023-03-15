export default {
  type: "object",
  properties: {
    category: { type: "string" },
    senderId: { type: "string", format: "mongoObjectId" },
    receiverId: { type: "string", format: "mongoObjectId" },
    rating: { type: "number" },
  },
  required: [],
  additionalProperties: false,
};
