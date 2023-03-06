require("dotenv").config();
const user = require("../models/user");
const job = require("../models/user").jobModel;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("../models/validator");

module.exports = {
  getSignupForm: async (req, res) => {
    res.render("employerSignup");
  },

  getloginForm: async (req, res) => {
    res.render("employerLogin");
  },

  // Signing up an emplyer logic
  createEmployer: async (req, res) => {
    const { error } = validator.validateEmployer.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const employer = new user.employerModel();
    const { name, email, number, address, gender, password } = req.body;

    employer.name = name;
    employer.email = email;
    employer.number = number;
    employer.address = address;
    employer.gender = gender;
    const suppliedPassword = password;

    try {
      employer.password = await bcrypt.hash(suppliedPassword, 10);
    } catch (error) {
      console.log("error", error);
    }
    //save new employer to database
    employer.save((err, savedObject) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        console.log(savedObject);
        res.redirect("http://localhost:2000/api/employer/login");
      }
    });
  },

  // Login Logic Goes Here
  loginEmployer: async (req, res) => {
    const { password, email } = req.body;

    try {
      const findUser = await user.employerModel.findOne({ email });
      const job = await user.jobModel.find({ email });
      const id = findUser._id;
      console.log(job);
      const isMatch = await bcrypt.compare(password, findUser.password);

      if (!findUser || !isMatch) {
        return res.json({
          msg: "email or password is invalid",
          error: true,
        });
      }
      // create and assign a token to a employer
      const token = jwt.sign(
        { _id: user.employerModel._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.set("auth-token", token);
      console.log(token);
      res.redirect(`http://localhost:2000/api/employer/${id}/openjob`);
    } catch (error) {
      res.json({
        msg: "email or password is invalid",
        error: true,
      });
      console.log("error", error);
    }
  },

  createJob: async (req, res) => {
    const { error } = validator.validateJob.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const job = new user.jobModel();
    const { title, amount, location, description, type, email } = req.body;
    job.title = title;
    job.amount = amount;
    job.location = location;
    job.description = description;
    job.jobType = type;
    job.email = email;

    // save new job to database
    try {
      await job.save((err, savedObject) => {
        if (err) {
          console.log(err);
          res.status(500).send();
        } else {
          res.json(savedObject);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  openJob: async (req, res) => {
    const userId = req.params.id;
    //const jobId = req.params.jobId;
    //console.log(userId);
    job.find({ _id: userId }, (error, job) => {
      if (error) {
        res.json({
          msg: "no job yet!!",
        });
        console.log("error!!", error);
      } else {
        res.render("openJob", { job: job, userId: userId });
      }
    });
  },
};
