console.log(
  'This script populates some test smoothies, categories, and ingredients to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

require("dotenv").config();

const Post = require("./models/post");
const User = require("./models/user");
const Comment = require("./models/comment");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catc((err) => {
  console.log(err);
});

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(process.env.MONGO_DB);
  console.log("Debug: Should be connected?");
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}
