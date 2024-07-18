const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

exports.write_blogpost_post = [
  body("title", "Must enter a title")
    .trim()
    .isLength({ min: 1 })
    .blacklist("<>/"),

  body("text", "Must write text for your blog post")
    .trim()
    .isLength({ min: 1 })
    .blacklist("<>/"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      const blogpost = new Post({
        title: req.body.title,
        text: req.body.text,
        timestamp: new Date(),
        author: "66984ddf79fda4e203817e30",
        published: req.body.published,
        comments: [],
      });

      await blogpost.save();
      res.send(blogpost);
    }
  }),
];

exports.post_list_get = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find()
    .sort({ timestamp: 1 })
    .populate("author", "first_name last_name")
    .populate("comments")
    .exec();

  res.send(allPosts);
});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId)
    .populate("author", "first_name last_name")
    .populate("comments")
    .exec();

  res.send(post);
});
