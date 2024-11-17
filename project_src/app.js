require('dotenv').config();


const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
const port = 8080;



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));



// Set view engine
app.set("view engine", "ejs");


// Routes

//Home
router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/', function(req,res){
  res.sendFile(path + 'index.html');
});


// Login Route
app.get("/aal1", (req, res) => {
  res.render(path + "aal1");
});

app.post("/aal1", async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).send("Invalid username or password");
      }
      req.session.userId = user._id;
      res.redirect(path + "/dashboard");
  } catch (error) {
      res.status(400).send("Login error");
  }
});

// Dashboard Route
app.get("/dashboard", (req, res) => {
  if (!req.session.userId) {
      return res.redirect(path + "/aal1");
  }
  res.send("Welcome to your dashboard");
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});









app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})