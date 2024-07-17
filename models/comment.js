const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema({
  timestamp: { type: Date, required: true },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "User" },
});

CommentSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

CommentSchema.virtual("url").get(function () {
  return `/blog/comment/${this.id}`;
});

module.exports = mongoose.model("Comment", CommentSchema);
