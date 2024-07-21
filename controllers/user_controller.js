const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const utils = require("../utils");

exports.user_login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json({ success: false, msg: "Could not find user" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      const tokenObject = utils.issueJWT(user);

      res.status(200).json({
        success: true,
        user: user,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } else {
      res
        .status(401)
        .json({ success: false, msg: "You entered the wrong password" });
    }
  } catch (err) {
    next(err);
  }
};

exports.user_create_post = [
  body("first_name", "first name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "last name must not be empty")
    .isLength({ min: 1 })
    .trim()
    .escape(),
  body("email", "email must not be empty")
    .isEmail()
    .withMessage("Must be an email. i.e. hello@example.com")
    .trim()
    .escape(),
  body("username", "username must not be empty")
    .isLength({ min: 1 })
    .trim()
    .escape(),
  body("password", "must enter a password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 8 characters")
    .trim()
    .escape(),
  body("confirm_password", "must confirm password. Cannot be empty")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    })
    .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // Errors Exist
        res.send("Form input errors present");
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            return next(err);
          }
          const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            isAdmin: req.body.isAdmin,
          });

          await user.save();
          const jwt = utils.issueJWT(user);
          res.json({
            success: true,
            user: user,
            token: jwt.token,
            expiresIn: jwt.expires,
          });
        });
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.user_list_get = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find(
    {},
    "first_name last_name username email isAdmin",
  )
    .sort({ last_name: 1 })
    .exec();

  res.send(allUsers);
});

exports.user_detail_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();

  res.send(user);
});
