require('dotenv').config();

const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
const port = 80;



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


// homepage Route
app.get("/homepage", (req, res) => {
  if (!req.session.userId) {
      return res.sendFile(path + "/index.html");
  }
  const username = req.session.username || 'Guest';
  res.render(path + "/homepage", { username });
});


// Create User
app.get("/createuser", (req, res) => {
  res.render(path + "/create_user");
});

app.post("/createuser", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send("User already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Optionally set the session and redirect or respond
    req.session.userId = newUser._id;
    res.status(201).send("User created successfully. You can now log in.");
} catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Server error while creating user.");
}
});





// Login Route
app.get("/aal1", (req, res) => {
  res.render(path + "/aal1");
});

app.post("/aal1", async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).send("Invalid username or password");
      }
      req.session.userId = user._id;
      req.session.username = user.username;
      res.redirect("/homepage");
  } catch (error) {
      res.status(400).send("Login error");
  }
});


// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.sendFile(path + "/index.html");
});






app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})