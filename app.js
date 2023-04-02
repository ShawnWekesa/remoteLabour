const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const dotenv = require("dotenv");

// loading the envariables
dotenv.config()


const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/login", (req, res) => {
    res.render("login-form");
})

app.get("/profiles", (req, res) => {
    res.render("profiles");
})

app.get("/my-account", (req, res) => {
    res.render("my-account");
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Listening on 0.0.0.0:${port}`
  );
});