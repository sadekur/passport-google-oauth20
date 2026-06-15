const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/register", checkLoggedIn, (req, res) => {
  res.render("register");
});

router.post("/register", checkLoggedIn, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already exists.");
      return res.redirect("/register");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

router.get("/login", checkLoggedIn, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  checkLoggedIn,
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Successfully logged in with Google.");
    res.redirect("/profile");
  }
);

router.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have been logged out.");
    res.redirect("/");
  });
});

module.exports = router;