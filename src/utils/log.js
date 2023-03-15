import pino from "pino";
import config from "./config.js";

const level = config.LOG_LEVEL;

if (!pino.levels.values[level]) {
  const validLevels = Object.keys(pino.levels.values).join(", ");
  throw new Error(`Log level must be one of: ${validLevels}`);
}

const logger = (name) => pino({ name, level });

export default logger;
