import mongoose from "mongoose";
import validator from "validator";

import { handleDuplicateKeyError } from "./error.js";

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
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
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
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

const Employer = mongoose.model("Employer", schema);

export default Employer;
