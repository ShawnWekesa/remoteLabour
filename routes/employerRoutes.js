const express = require("express");
const router = express.Router();
const employerController = require("../controllers/employerController");
const verify = require("../controllers/verifyToken");

// get signup & login form routes
router.get("/login", employerController.getloginForm);
router.get("/signup", employerController.getSignupForm);

// collects inputs from forms
router.post("/signup", employerController.createEmployer);
router.post("/login", employerController.loginEmployer);

// get jobs posted by a particular employer
router.get("/:id/openjob", verify.auth, employerController.openJob);

//post jobs
router.post("/job", employerController.createJob);

module.exports = {
  router,
};
