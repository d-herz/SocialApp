const Comment = require("../models/Comment");
const Post = require("../models/Post");


module.exports = {
  createComment: async (req, res) => {
    try {
      
      //Adding incrementor for updating numOfComments property on post
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { numOfComments: 1}
        }
      )

      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        createdBy: req.user.userName,
        createdById: req.user.id,
      });
      console.log("Comment has been added!");
      res.redirect(`/post/${req.params.id}/#commentDiv`);
    } catch (err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    try {
      const comment = await Comment.findOneAndUpdate( 
        { _id: req.params.id },
        {
          $inc: { likes: 1 }, 
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${comment.post}/#commentDiv`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {

      const comment = await Comment.findById({ _id: req.params.id }); //the .id is our choice, could do commentId (and be sure to specify in EJS and also put it in the router path)
      //adding a decrementor for updating numOfComments property on post
      const post = await Post.findOneAndUpdate(
        { _id: comment.post },
        {
          $inc: { numOfComments: -1}
        }
      )
      await Comment.deleteOne({ _id: req.params.id }); 
      console.log("Deleted Comment");
      console.log(comment)
      res.redirect(`/post/${comment.post}/#commentDiv`); 
    } catch (err) {
      // res.redirect(`/post/${req.params.id}`);
      console.log(err)
    }
  },
}; 

