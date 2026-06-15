const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const app = express();
require("dotenv").config();
require("./config/database");
require("./config/passport");

const authRoutes = require("./routes/auth.routes");

const requiredEnv = ["MONGO_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`WARNING: Missing environment variable ${key}`);
  }
});

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  res.locals.user = req.user || null;
  res.locals.path = req.path;
  res.locals.googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use(authRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("404", { error: err.message });
});

module.exports = app;