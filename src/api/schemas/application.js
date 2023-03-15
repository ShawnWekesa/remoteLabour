export default {
  type: "object",
  properties: {
    recruiterId: { type: "string", format: "mongoObjectId" },
    jobId: { type: "string", format: "mongoObjectId" },
    status: { type: "string" },
    dateOfApplication: { type: "string", format: "date-time" },
    dateofJoining: { type: "string", format: "date-time" },
    sop: { type: "string" },
  },
  required: ["recruiterId", "jobId"],
  additionalProperties: false,
};
