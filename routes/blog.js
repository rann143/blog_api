const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/user_controller");
const post_controller = require("../controllers/post_controller");
const comment_controller = require("../controllers/comment_controller");

router.get("/", function (req, res, next) {
  res.send("Welcome to the Blog");
});

// Routes for User

// ****************************
// SIGN UP FORM
// ****************************

// //GET route for sign up/create new user
// router.get("/sign-up", user_controller.user_create_get);

//POST route for creating new user
router.post("/sign-up", user_controller.user_create_post);

// FOR ADMIN ONLY (SET UP AUTHORIZATION); get list of all users
router.get("/users", user_controller.user_list_get);

// FOR ADMIN ONLY (SET UP AUTHORIZATION); get list of single user
router.get("/users/:id", user_controller.user_detail_get);

// // ****************************

// ROUTES FOR POSTS

// GET route for post list
router.get("/posts", post_controller.post_list_get);

// GET route for single post
router.get("/posts/:postId", post_controller.post_detail_get);

// // FOR ADMIN ONLY (SET UP AUTHORIZATION); GET route for creating a blog post
// router.post("/write-blog-post", post_controller.create_blogpost_get);

// FOR ADMIN ONLY (SET UP AUTHORIZATION); POST route for creating a blog post
router.post("/write-blog-post", post_controller.write_blogpost_post);

// GET route for post comments
router.get(
  "/posts/:postId/comments",
  comment_controller.comment_list_for_post_get,
);

// POST route for comments
router.post("/posts/:id/write-comment", comment_controller.comment_create_post);

module.exports = router;
