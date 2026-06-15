const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const app = express();
require("./config/database");
require("dotenv").config();
require("./config/passport");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    // cookie: { secure: true },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// base url
app.get("/", (req, res) => {
  res.render("index");
});

const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

// register : get
app.get("/register", checkLoggedIn, (req, res) => {
  res.render("register");
});

// register : post
app.post("/register", checkLoggedIn, async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already exists.");
      return res.redirect("/register");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

// login : get
app.get("/login", checkLoggedIn, (req, res) => {
  res.render("login");
});

// login : post
app.post(
  "/login",
  checkLoggedIn,
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// profile protected route
app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

// logout route
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have been logged out.");
    res.redirect("/");
  });
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).render("404");
});

module.exports = app;
