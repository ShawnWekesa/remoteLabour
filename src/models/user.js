import mongoose from "mongoose";
import { randomBytes } from "crypto";
import isEmail from "validator/lib/isEmail.js";

import {
  generatePasswordHash,
  validatePassword,
  isPasswordHash,
} from "../utils/password.js";
import { handleDuplicateKeyError } from "./error.js";

const generateRandomToken = () =>
  randomBytes(48).toString("base64").replace(/[+/]/g, ".");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      validate: { validator: isEmail, message: "Invalid email" },
    },
    password: {
      type: String,
      required: true,
      validate: { validator: isPasswordHash, message: "Invalid password hash" },
    },
    token: {
      type: String,
      unique: true,
      index: true,
      default: generateRandomToken,
    },
    name: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
  }
);

schema.set("toJSON", {
  /* eslint-disable */
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.password;
    return ret;
  },
  /* eslint-enable */
});

schema.statics.authenticateWithPassword =
  async function authenticateWithPassword(email, password) {
    const user = await this.findOne({ email }).exec();
    if (!user) return null;

    const passwordValid = await validatePassword(password, user.password);

    if (!passwordValid) return null;

    user.lastLoginAt = Date.now();
    const updatedUser = await user.save();

    return updatedUser;
  };

schema.statics.authenticateWithToken = async function authenticateWithToken(
  token
) {
  return this.findOne({ token }).exec();
};

schema.methods.setPassword = async function setPassword(password) {
  this.password = await generatePasswordHash(password);
  if (!this.isNew) {
    await this.save();
  }
  return this;
};

schema.methods.regenerateToken = async function regenerateToken() {
  this.token = generateRandomToken();
  if (!this.isNew) {
    await this.save();
  }
  return this;
};

schema.post("save", handleDuplicateKeyError);
schema.post("update", handleDuplicateKeyError);
schema.post("findOneAndUpdate", handleDuplicateKeyError);
schema.post("insertMany", handleDuplicateKeyError);

const User = mongoose.model("User", schema);

export default User;
