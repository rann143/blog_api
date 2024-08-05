const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

exports.comment_create_post = [
  body("text", "Must write text for your comment")
    .trim()
    .isLength({ min: 1, max: 500 })
    .blacklist("<>/"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      const comment = new Comment({
        text: req.body.text,
        timestamp: new Date(),
        author: req.user._id,
        post: req.params.postId,
      });

      await comment.save();
      await Post.findByIdAndUpdate(req.params.postId, {
        $push: { comments: comment._id },
      }).exec();
      res.send(comment);
    }
  }),
];

exports.comment_list_for_post_get = asyncHandler(async (req, res, next) => {
  const allComments = await Comment.find({ post: req.params.postId })
    .sort({ timestamp: 1 })
    .populate("author", "username")
    .exec();

  res.send(allComments);
});

exports.comment_delete = asyncHandler(async (req, res, next) => {
  await Post.findByIdAndUpdate(req.params.postId, {
    $pull: { comments: { $in: [req.params.commentId] } },
  }).exec();

  await Comment.findByIdAndDelete(req.params.commentId).exec();

  const updatedPost = await Post.findById(req.params.postId).exec();
  res.send(updatedPost);
});
