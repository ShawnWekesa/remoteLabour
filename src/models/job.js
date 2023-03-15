import mongoose from "mongoose";

import { handleDuplicateKeyError } from "./error.js";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "Employer",
    },
    maxApplicants: {
      type: Number,
    },
    maxPositions: {
      type: Number,
    },
    activeApplications: {
      type: Number,
    },
    acceptedCandidates: {
      type: String,
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
    skillsets: {
      type: String,
    },
    duration: {
      type: Number,
    },
    salary: {
      type: Number,
    },
    rating: {
      type: Number,
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

const Job = mongoose.model("Job", schema);

export default Job;
