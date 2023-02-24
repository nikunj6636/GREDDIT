const mongoose = require("mongoose");

const SubgredditSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, "Please enter first name"]
  },
  description: {
    type: String,
    required: [true, "Please enter last name"]
  },
  created: {
      type: String,
      required: [true, "Please enter email"],
  },
  tags: [
    {
      type: String,
      required: true
    }
  ],
  banned: [
    {
      type: String,
      required: true
    }
  ],
  people: [ // followers of the subgreddits
    {
        type: String,
        ref: mongoose.Schema.User // user schema here
    }
  ],
  posts: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,  // creation date of the subgreddit
    required: true
  },
  removed: [{ // array to store banned persons of the subgreddits
    type: String
  }],
  join_requests: [{
    type: String
  }]
});

const Subgreddit = mongoose.model("Subgreddit", SubgredditSchema);

module.exports = Subgreddit;