import mongoose from "mongoose";

import { handleDuplicateKeyError } from "./error.js";

const schema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Employer",
    },
    jobId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Job",
    },
    status: {
      type: String,
      default: "applied",
    },
    dateOfApplication: {
      type: Date,
      default: Date.now,
    },
    dateofJoining: {
      type: Date,
    },
    sop: {
      type: String,
      maxLength: 250,
    },
  },
  {
    versionKey: false,
  }
);

schema.post("save", handleDuplicateKeyError);
schema.post("update", handleDuplicateKeyError);
schema.post("findOneAndUpdate", handleDuplicateKeyError);
schema.post("insertMany", handleDuplicateKeyError);

const Application = mongoose.model("Application", schema);

export default Application;
