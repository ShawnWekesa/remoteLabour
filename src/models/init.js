import mongoose from "mongoose";
import logger from "../utils/log.js";

const log = logger("models");

const dbInit = async (mongoUrl, options = {}) => {
  const mongoOpts = {
    ...options,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };

  if (!mongoUrl) {
    throw new Error(
      "MongoDB URL not configured - set DATABASE_URL env variable"
    );
  }

  mongoose.set("useCreateIndex", true);
  mongoose.set("useFindAndModify", false);

  try {
    await mongoose.connect(mongoUrl, mongoOpts);
    log.debug(`Connected to MongoDB at ${mongoUrl}`);
  } catch (err) {
    log.fatal("Error connecting to database:", err);
    throw err;
  }
};

export default dbInit;
