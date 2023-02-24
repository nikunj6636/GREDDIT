const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const ReportSchema = new mongoose.Schema({
  concern: {
      type: String,
      required: [true, "Please enter your concern"]
  },
  reportedby: {
    type: String, // email of the person who reported it
    required: true
  },
  reporteduser: {
    type: String, // email of person who posted that post
    required: true
  },
  post: {   
    type: ObjectId, // postId of the post
    required: true  
  },
  date: {
    type: Date,
    required: true
  },
  reportedin: {
    type: ObjectId, // subgredditId in which it is reported
    required: true  
  },
  ignored: {
    type: String, // to ignore the report or not
  }
});

const Report = mongoose.model("Report", ReportSchema);

module.exports = Report;