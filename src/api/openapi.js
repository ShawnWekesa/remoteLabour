import swaggerJsDoc from "swagger-jsdoc";

import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  userSchema,
} from "./schemas/auth.js";
import candidateSchema from "./schemas/candidate.js";
import employerSchema from "./schemas/employer.js";
import jobSchema from "./schemas/job.js";
import ratingSchema from "./schemas/rating.js";
import applicationSchema from "./schemas/application.js";

export const definition = {
  openapi: "3.0.0",
  info: {
    title: "remoteLabour",
    version: "0.0.1",
    description:
      "A nodejs, express web application for job seekers to search for employment, and employers to look for people with qualifications they seek. The employers and prospective employers should be able to create a profile, edit it at will, upload images of the picture, any required credential and certifications at will, edit and delete it. An employer can post a new job with title, description, qualitifications, locations, price, whether part time or full time. Prospectiveemployees can view jobs, accept jobs etc.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  components: {
    schemas: {
      Candidate: candidateSchema,
      Employer: employerSchema,
      Job: jobSchema,
      Rating: ratingSchema,
      Application: applicationSchema,
      loginSchema,
      registerSchema,
      changePasswordSchema,
      User: userSchema,
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        description: "Simple bearer token",
        scheme: "bearer",
        bearerFormat: "simple",
      },
    },
  },
};

const options = {
  definition,
  apis: ["./src/api/routes/*.js"],
};

const spec = swaggerJsDoc(options);

export default spec;
