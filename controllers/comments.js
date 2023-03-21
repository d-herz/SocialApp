const Comment = require("../models/Comment");
const Post = require("../models/Post");


module.exports = {
  createComment: async (req, res) => {
    try {
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
      const comment = await Comment.findById(req.params.commentId)
      let liker = req.params.userId

      if (comment.usersWhoLiked.includes(liker)) {
        await Comment.findOneAndUpdate(
          { _id: req.params.commentId },
          {
            $inc: { likes: -1 },
            $pull: { usersWhoLiked: liker }
          }
        );        
      } else {
        await Comment.findOneAndUpdate( 
          { _id: req.params.commentId },
          {
            $inc: { likes: 1 }, 
            $push: { usersWhoLiked: liker }
          }
        );
      }
      console.log("Likes Updated");
      res.redirect(`/post/${comment.post}/#commentDiv`);
    } catch (err) {
      console.log(err);
    }
  },
  editComment: async (req, res) => {
    try{
      console.log(`this is supposed to be the comment id: ${req.params.commentId}`)
      
      const comments = await Comment.find({post: req.params.commentId, id: req.params.commentId})
     
      const commentToEdit = await Comment.findOneAndUpdate(
        { _id: req.params.commentId },
        { 
          comment: req.body.editedComment, 
        },
      );
      console.log("Comment Updated");
      console.log(`${req.params.commentId} id for comment?`);
      res.redirect(`/post/${commentToEdit.post}/#commentDiv`);
    } catch (err) {
      console.log(err)
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findById({ _id: req.params.id }); 
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

