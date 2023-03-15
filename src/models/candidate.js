import mongoose from "mongoose";
import validator from "validator";

import { handleDuplicateKeyError } from "./error.js";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    acceptedJobs: {
      type: Number,
    },
    rejectedJobs: {
      type: Number,
    },
    userId: {
      type: mongoose.ObjectId,
    },
    skills: {
      type: String,
    },
    rating: {
      type: String,
    },
    resume: {
      type: String,
    },
    profile: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactNumber: {
      type: String,
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

const Candidate = mongoose.model("Candidate", schema);

export default Candidate;
