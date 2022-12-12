const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id }).sort({ createdAt: "desc" });
      
      res.render("profile2.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getOtherProfile: async (req, res) => {
    try {
      const otherUser = await User.findById(req.params.id) 

      const posts = await Post.find({ user: req.params.id }).sort({ createdAt: "desc" });
      
      res.render("otherProfile.ejs", { posts: posts, user: req.user, otherUser: otherUser });

    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }); //Post is the model (required above), .lean() (mongoose) is for getting the raw object from mongo (documents on mongo, while similar to "objects" actually include more than you need) this will be faster
      console.log(`These are your posts ${posts}`)
      res.render("feed2.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId); //.id is the variable from the route
      const comments = await Comment.find({post: req.params.postId}).sort({ createdAt: "asc" });
      
      const commentId = comments.map( (x,i) => x._id ) // maybe it needs to loop through the array of objects, and pull out the id's?
      // console.log(`This is the commentId: ${commentId}`)

      res.render("post2.ejs", { post: post, user: req.user, comments: comments, commentId: commentId});
      // console.log(`Check out these ${comments}`)
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path); //upload is from the cloudinary package

      await Post.create({
        title: req.body.title,
        image: result.secure_url, //result declared above
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        numOfComments: 0,
        user: req.user.id,
        createdBy: req.user.userName,
      });
      console.log("Post has been added!");
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      let liker = req.params.userId;

      if (post.usersWhoLiked.includes(liker)) {
        await Post.findOneAndUpdate( 
          { _id: req.params.postId },
          {
            $inc: { likes: -1 }, 
            $pull: { usersWhoLiked: liker }
          }
        ); 
      } else {
        await Post.findOneAndUpdate( 
          { _id: req.params.postId },
          {
            $inc: { likes: 1 }, 
            $push: { usersWhoLiked: liker}
          }
        );
      }
      console.log("Likes Updated");
      res.redirect(`/post/${req.params.postId}/#commentDiv`);
    } catch (err) {
      console.log(err);
    }
  },

  editPost: async (req, res) => {
    try{
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { //didn't need $set apparently
          title: req.body.title, 
          caption: req.body.caption,
        },
        // {
        //   new: true, //apparently don't need this?
        // }
      );
      console.log("Post Updated");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id }); //Post is the model. find the post using the id from the url (this makes sure the post exists before you 'destroy' it)
      // Delete image from cloudinary

      //find comments associated with post and delete along with post
      const comments = await Comment.deleteMany({post: req.params.id})

      await cloudinary.uploader.destroy(post.cloudinaryId); //post declared above. This line is to get rid of the picture on cloudinary
      // Delete post from db
      await Post.remove({ _id: req.params.id }); //Post is the model, here we remove the post from the collection
      console.log("Deleted Post");
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
