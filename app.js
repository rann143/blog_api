const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
require("dotenv").config();
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const indexRouter = require("./routes/index");
const blogRouter = require("./routes/blog");

require("./passport")(passport);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

app.use(limiter);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => {
  console.log(err);
});
async function main() {
  await mongoose.connect(process.env.MONGO_DB);
}

app.use(compression());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/blog", blogRouter);

console.log(process.env.PORT);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  // set locals, only providing error in development
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
