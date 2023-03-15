import repl from "repl";

import config from "../src/utils/config.js";
import app from "../src/app.js";
import mongoInit from "../src/models/init.js";
import User from "../src/models/user.js";
import Candidate from "../src/models/candidate.js";
import Employer from "../src/models/employer.js";
import Job from "../src/models/job.js";
import Rating from "../src/models/rating.js";
import Application from "../src/models/application.js";
import UserService from "../src/services/user.js";
import CandidateService from "../src/services/candidate.js";
import EmployerService from "../src/services/employer.js";
import JobService from "../src/services/job.js";
import RatingService from "../src/services/rating.js";
import ApplicationService from "../src/services/application.js";

const main = async () => {
  await mongoInit(config.DATABASE_URL);
  process.stdout.write("Database and Express app initialized.\n");
  process.stdout.write("Autoimported modules: config, app, models, services\n");

  const r = repl.start("> ");
  r.context.config = config;
  r.context.app = app;
  r.context.models = {
    User,
    Candidate,
    Employer,
    Job,
    Rating,
    Application,
  };
  r.context.services = {
    UserService,
    CandidateService,
    EmployerService,
    JobService,
    RatingService,
    ApplicationService,
  };

  r.on("exit", () => {
    process.exit();
  });

  r.setupHistory(".shell_history", () => {});
};

main();
