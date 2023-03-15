import { randomBytes } from "crypto";

import User from "../models/user.js";
import DatabaseError from "../models/error.js";
import { generatePasswordHash, validatePassword } from "../utils/password.js";

const generateRandomToken = () =>
  randomBytes(48).toString("base64").replace(/[+/]/g, ".");

class UserService {
  static async list() {
    try {
      return User.find();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return User.findOne({ _id: id }).exec();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return User.findOneAndUpdate({ _id: id }, data, {
        new: true,
        upsert: false,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return result.deletedCount === 1;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async authenticateWithPassword(email, password) {
    try {
      const user = await User.findOne({ email }).exec();
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);

      if (!passwordValid) return null;

      user.lastLoginAt = Date.now();
      const updatedUser = await user.save();
      return updatedUser;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async authenticateWithToken(token) {
    try {
      return User.findOne({ token }).exec();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async createUser({ password, ...userData }) {
    const hash = await generatePasswordHash(password);

    try {
      const user = new User({
        ...userData,
        password: hash,
      });

      await user.save();
      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async setPassword(user, password) {
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async regenerateToken(user) {
    user.token = generateRandomToken(); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default UserService;
