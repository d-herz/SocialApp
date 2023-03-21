const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); 
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth"); 

//Post Routes
router.get("/:postId", ensureAuth, postsController.getPost); 

router.post("/createPost", upload.single("file"), postsController.createPost); 

//Route for liking a post (updates like count)
router.put("/likePost/:postId/:userId", postsController.likePost);

//Route for editing a post (update request)
router.put("/editPost/:id", postsController.editPost)

//Route for deleting a post
router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
