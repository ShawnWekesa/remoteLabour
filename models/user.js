const { string } = require("@hapi/joi");
const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  number: Number,
  address: String,
  gender: String,
  password: String,
  acceptedJobs: [String],
  rejectedJobs: [String],
});

const employerSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    number: Number,
    address: String,
    gender: String,
    password: String,
  });

const jobSchema = mongoose.Schema({
  title: String,
  amount: String,
  jobType: String,
  location: String,
  description: String,
  created: { type: Date, default: Date.now },
  email: String,
});


  const candidateModel = mongoose.model("Candidate", candidateSchema);
  const employerModel = mongoose.model("Employer", employerSchema);
  const jobModel = mongoose.model("Job", jobSchema );

  //employerModel.findById

  module.exports ={
    candidateModel,
    employerModel,
    jobModel
  }