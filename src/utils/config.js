import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "production";
const DEFAULT_LOG_LEVEL = NODE_ENV === "production" ? "info" : "debug";

export default {
  NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST || "localhost",
  NODEMAILER_PORT: process.env.NODEMAILER_PORT || 25,
  NODEMAILER_USER: process.env.NODEMAILER_USER || undefined,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS || undefined,
  NODEMAILER_SECURE: process.env.NODEMAILER_SECURE || false,
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  BG_TASKS_QUEUE: process.env.BG_TASKS_QUEUE || "bg-tasks",
};
