const express = require("express");
const router = express.Router();
const employerController = require("../controllers/employerController");
const verify = require("../controllers/verifyToken");

// get homepage
router.get("/", verify.auth, employerController.openJob);

//post jobs
router.post("/job", employerController.createJob);

module.exports = {
  router,
};
