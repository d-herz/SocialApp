const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Create comments 
router.post("/createComment/:id", commentsController.createComment); 

// Like comment
router.put("/likeComment/:commentId/:userId", commentsController.likeComment);

// Edit comment
router.put("/editComment/:commentId", commentsController.editComment)

router.delete("/deleteComment/:id", commentsController.deleteComment);

module.exports = router;
