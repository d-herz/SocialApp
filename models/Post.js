const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  numOfComments:{
    type: Number,
    required: true,
  },
  // numOfComments: { //trying to count number of comments for display
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Comment", //here we are referencing our "Comment" model from our Comment schema?
  // },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //here we are referencing our "User" model from our User schema
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
