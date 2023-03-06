const express = require("express");
const app = express();
const PORT = 3000  || process.env.PORT;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const candidateRoutes = require("./routes/candidateRoutes");
const employerRoutes = require("./routes/employerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const cors = require("cors");
const connectDB = require('./config/db')

const dotenv = require('dotenv')

// loading the config files
dotenv.config({ path: './config/config.env' })


//  APP CONFIG
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


connectDB()

app.use('/', homeRoutes.router)
app.use("/candidate", candidateRoutes.router);
app.use("/employer", employerRoutes.router);

app.listen(PORT, () => {
  console.log(`Your app is running on port http://localhost:${PORT}`);
});
