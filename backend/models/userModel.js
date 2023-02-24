const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  first_name: {
      type: String,
      required: [true, "Please enter first name"]
  },
  last_name: {
    type: String,
    required: [true, "Please enter last name"]
  },
  email: {
      type: String,
      required: [true, "Please enter email"],
      unique: [true, "Email already exists"],
  },
  username: {
      type: String,
      required: [true, "Please enter username"],
      minlength: [6, "Username must be of minimum 6 characters"],
      unique: [true, "Username already exists"],
  },
  password: {
      type: String,
      required: [true, "Please enter password"],
      minlength: [6, "Password must be of minimum 6 characters"],
      // select: false,
  },
  age: {
    type: Number,
    required: [true, "Please enter your age"]
  },
  contact_number: {
    type: String,
    minlength: [10, "Phone number must contain 9 digit"],
    maxlength: [10, "Phone number must contain 9 digit"],
    required: [true, "Please enter your phone number"],
    unique: [true, "Phone number already exists"]
  },
  followers: [
    {
      type: String,
      ref: "User",  // email referencing to user
    }
  ],
  following: [
    {
      type: String,
      ref: "User",
    }
  ]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;