import Candidate from "../models/candidate.js";
import DatabaseError from "../models/error.js";

class CandidateService {
  static async list() {
    try {
      return Candidate.find();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Candidate.findOne({ _id: id }).exec();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      const obj = new Candidate(data);
      await obj.save();
      return obj;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Candidate.findOneAndUpdate({ _id: id }, data, {
        new: true,
        upsert: false,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      const result = await Candidate.deleteOne({ _id: id }).exec();
      return result.deletedCount === 1;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default CandidateService;
