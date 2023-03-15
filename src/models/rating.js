import mongoose from "mongoose";

import { handleDuplicateKeyError } from "./error.js";

const schema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: 'enum["job", "candidate"]',
    },
    senderId: {
      type: mongoose.ObjectId,
      ref: "Job",
    },
    receiverId: {
      type: mongoose.ObjectId,
      ref: "Job",
    },
    rating: {
      type: Number,
      default: -1.0,
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

const Rating = mongoose.model("Rating", schema);

export default Rating;
