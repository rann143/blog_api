const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

exports.write_blogpost_post = [
  body("title", "Must enter a title").trim().isLength({ min: 1 }),

  body("text", "Must write text for your blog post")
    .trim()
    .isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      const blogpost = new Post({
        title: req.body.title,
        text: req.body.text,
        timestamp: new Date(),
        author: req.user._id,
        published: req.body.published,
        comments: [],
      });

      await blogpost.save();
      res.send(blogpost);
    }
  }),
];

exports.post_list_get_published = asyncHandler(async (req, res, next) => {
  const publishedPosts = await Post.find({ published: true })
    .sort({ timestamp: 1 })
    .populate("author", "first_name last_name")
    .populate("comments")
    .exec();

  res.send(publishedPosts);
});

exports.post_list_get_all = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .sort({ timestamp: 1 })
    .populate("author", "first_name last_name")
    .populate("comments")
    .exec();

  res.send(allPosts);
});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  const [post, allComments] = await Promise.all([
    Post.findById(req.params.postId)
      .populate("author", "first_name last_name")
      .exec(),
    Comment.find({ post: req.params.postId })
      .sort({ timestamp: 1 })
      .populate("author", "username")
      .exec(),
  ]);

  post.comments = allComments;

  res.send(post);
});

exports.blog_post_update = [
  (req, res, next) => {
    if (!Array.isArray(req.body.comments)) {
      req.body.comments =
        typeof req.body.comments === "undefined" ? [] : [req.body.comments];
    }
    next();
  },

  body("title", "Must enter a title").trim().isLength({ min: 1 }),

  body("text", "Must write text for your blog post")
    .trim()
    .isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      const originalPost = await Post.findById(req.params.postId).exec();

      const blogpost = new Post({
        _id: req.params.postId,
        title: req.body.title,
        text: req.body.text,
        timestamp: originalPost.timestamp,
        author: originalPost.author,
        published: req.body.published,
        comments: originalPost.comments,
      });

      await Post.findByIdAndUpdate(req.params.postId, blogpost, {});
      res.send(blogpost);
    }
  }),
];

exports.blog_post_delete = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).exec();
  const comments = post.comments;

  for (const comment of comments) {
    await Comment.findByIdAndDelete(comment);
  }

  await Post.findByIdAndDelete(req.params.postId).exec();
  res.send("post deleted");
});
