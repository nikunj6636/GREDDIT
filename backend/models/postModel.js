const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema({
  text: {
      type: String,
      required: [true, "Please enter the post"]
  },
  postedby: {
    type: String, // email of person who posted it
    required: true
  },
  postedin: {   // subgreddit in which it was posted
    type: ObjectId,
    required: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true
  },
  comments: [{
    type: String
  }],
  savedby: [{
    type: String // array of email of the persons who saved that post
  }]
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;