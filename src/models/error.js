import mongoose from "mongoose";

class DatabaseError extends Error {
  constructor(mongooseError) {
    super(mongooseError.msg);
    this.code = mongooseError.name;
    this.details = mongooseError.errors;
  }

  isClientError() {
    return this.code === "ValidationError";
  }
}

export const handleDuplicateKeyError = function handleDuplicateKeyError(
  error,
  res,
  next
) {
  if (error.name === "MongoError" && error.code === 11000) {
    const err = new mongoose.Error.ValidationError(null);
    for (const key in error.keyValue) {
      err.addError(
        key,
        `Duplicate unique key ${key}: '${error.keyValue[key]}'`
      );
    }
    next(err);
  } else {
    next(error);
  }
};

export default DatabaseError;
