
const user = require("../models/user");
const job = require("../models/user").jobModel;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("../models/validator");

const dotenv = require('dotenv')

// loading the config files
dotenv.config({ path: './config/config.env' })


module.exports = {
  getLoginForm: async (req, res) => {
    res.render("candidateLogin");
  },

  getSignupForm: async (req, res) => {
    res.render("candidateSignup");
  },
  // Registration logic goes here
  createCandidate: async (req, res) => {
    const { error } = validator.validateCandidate.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const candidate = new user.candidateModel();
    const { name, email, number, address, gender, password } = req.body;

    candidate.name = name;
    candidate.email = email;
    candidate.number = number;
    candidate.address = address;
    candidate.gender = gender;
    const suppliedPassword = password;

    try {
      candidate.password = await bcrypt.hash(suppliedPassword, 10);
      await candidate.save();
      console.log(candidate);
      res.redirect("http://localhost:2000/api/candidate/login");
    } catch (error) {
      console.log("error", error);
    }
  },
  //Login logic goes here
  loginCandidate: async (req, res) => {
    const { password, email } = req.body;

    try {
      const findUser = await user.candidateModel.findOne({ email });
      const isMatch = await bcrypt.compare(password, findUser.password);
      const id = findUser._id;
      //console.log(id)
      if (!findUser || !isMatch) {
        return res.json({
          msg: "email or password is invalid",
          error: true,
        });
      }
      // create and assign a token to a candidate
      const token = jwt.sign(
        { _id: user.candidateModel._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.set("auth-token", token);
      console.log(token);
      res.redirect(`http://localhost:2000/api/candidate/${id}/job`);
    } catch (error) {
      res.json({
        msg: "email or password is invalid",
        error: true,
      });
      console.log("error", error);
    }
  },

  showJobs: async (req, res) => {
    const userId = req.params.id;
    //const jobId = req.params.jobId;
    console.log(userId);
    job.find({}, (error, job) => {
      if (error) {
        res.json({
          msg: "no job yet!!",
        });
        console.log("error!!", error);
      } else {
        res.render("receivedJobs", { job: job, userId: userId });
      }
    });
  },

  acceptedJobs: async (req, res) => {
    const userId = req.params.id;
    const jobId = req.params.jobId;

    try {
      const findCandidate = await user.candidateModel.findById({ _id: userId });

      findCandidate.acceptedJobs.push(jobId);
      console.log(jobId + "idjob");
      findCandidate.save();

      accepted = await job.find({ _id: findCandidate.acceptedJobs });

      return res.render("acceptedJobs", { job: accepted, userId: userId });
    } catch (error) {
      console.log(error);
    }
  },
  rejectJobs: async (req, res) => {
    const userId = req.params.id;
    const jobId = req.params.jobId;

    try {
      const findCandidate = await user.candidateModel.findById({ _id: userId });

      findCandidate.rejectedJobs.push(jobId);
      console.log(jobId + "idjob");
      findCandidate.save();
      rejectedJobs = await job.find({ _id: findCandidate.rejectedJobs });
      //console.log(rejectedJobs);
      return res.render("rejectedJobs", { job: rejectedJobs, userId: userId });
    } catch (error) {
      console.log(error);
    }
  },

  undoAccept: async (req, res) => {
    const userId = req.params.id;
    const jobId = req.params.jobId;

    try {
      const findCandidate = await user.candidateModel.findById({ _id: userId });

      //job.update({findCandidate},{$pull: {acceptedJobs :{_id: jobId}}})

      findCandidate.acceptedJobs.splice(jobId);
      findCandidate.save();
      res.redirect("back");
    } catch (error) {
      console.log(error);
    }
  },
  undoReject: async (req, res) => {
    const userId = req.params.id;
    const jobId = req.params.jobId;

    try {
      const findCandidate = await user.candidateModel.findById({ _id: userId });

      //job.update({findCandidate},{$pull: {rejectedJObs :{_id: jobId}}})
      findCandidate.rejectedJobs.splice(jobId);
      findCandidate.save();
      res.redirect("back");
    } catch (error) {
      console.log(error);
    }
  },
};
