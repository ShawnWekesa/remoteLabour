const express = require("express");
const router = express.Router();
const employerController = require("../controllers/employerController");
const verify = require("../controllers/verifyToken");

// get homepage
router.get("/", (req, res) => {
  res.render('home')
});

// get login
router.get("/login", (req, res) => {
  res.render('login')
});

// get profile 
router.get("/profile", (req, res) => {
  res.render('profile')
});

// get jobs 
router.get("/jobs", (req, res) => {
  res.render('jobs')
});



//post jobs
router.post("/job", employerController.createJob);

module.exports = {
  router,
}
