const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verify = require("../controllers/verifyToken");

// get signup & login form routes
router.get("/login", userController.getLoginForm);
router.get("/signup", userController.getSignupForm);

// collects inputs from forms
router.post("/signup", userController.createCandidate);
router.post("/login", userController.loginCandidate);

//get all lists of avaialable jobs posted by employers
router.get("/:id/job", verify.auth, userController.showJobs);

// accepted & rejected job routes
router.get("/jobs/:id/:jobId/accept", userController.acceptedJobs);
router.get("/jobs/:id/:jobId/reject", userController.rejectJobs);

// undo routes
router.get("/jobs/:id/:jobId/undoaccept", userController.undoAccept);
router.get("/jobs/:id/:jobId/undoreject", userController.undoReject);


module.exports = {
  router,
};
