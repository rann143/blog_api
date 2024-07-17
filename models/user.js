const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, maxlength: 100, required: true },
  last_name: { type: String, maxlength: 100, required: true },
  email: { type: String, maxlength: 100, required: true },
  username: { type: String, maxlength: 30, required: true },
  password: { type: String, maxlength: 100, required: true },
  isAdmin: { type: Boolean, required: true },
});

UserSchema.virtual("fullname").get(function () {
  let fullname = "";
  if (this.first_name && this.last_name) {
    fullname = `${this.first_name} ${this.last_name}`;
  }
  return fullname;
});

UserSchema.virtual("url").get(function () {
  return `/blog/user/${this.id}`;
});

module.exports = mongoose.model("User", UserSchema);
