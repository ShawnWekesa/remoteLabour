import { Router } from "express";
import swaggerUI from "swagger-ui-express";

import { authenticateWithToken } from "../middlewares/auth.js";
import { handle404, handleError } from "../middlewares/errors.js";
import authRouter from "./auth.js";
import candidateRouter from "./candidate.js";
import employerRouter from "./employer.js";
import jobRouter from "./job.js";
import ratingRouter from "./rating.js";
import applicationRouter from "./application.js";
import urls from "../urls.js";
import spec from "../openapi.js";

const router = Router();

// Swagger API docs
const swaggerSpecPath = `${urls.swagger.path}/${urls.swagger.spec}`;
const swaggerUIOptions = {
  swaggerOptions: {
    url: swaggerSpecPath,
  },
};
router.get(swaggerSpecPath, (req, res) => res.json(spec));
router.use(
  urls.swagger.path,
  swaggerUI.serve,
  swaggerUI.setup(null, swaggerUIOptions)
);

// Authentication
router.use(authenticateWithToken);
router.use(urls.apiPrefix + urls.auth.path, authRouter);

// CRUD API
router.use(urls.apiPrefix + urls.candidate.path, candidateRouter);
router.use(urls.apiPrefix + urls.employer.path, employerRouter);
router.use(urls.apiPrefix + urls.job.path, jobRouter);
router.use(urls.apiPrefix + urls.rating.path, ratingRouter);
router.use(urls.apiPrefix + urls.application.path, applicationRouter);

// Redirect browsers from index to API docs
router.get("/", (req, res, next) => {
  if (req.accepts("text/html")) {
    res.redirect(urls.swagger.path);
  } else {
    next();
  }
});

// Error handlers
router.use(handle404);
router.use(handleError);

export default router;
