const express = require('express');
const { requireSignIn } = require('../controllers/userController');
const { createPostController, getAllPosts, getUserPost, deleteUserPost,updateUserPost } = require('../controllers/postController');


// router obj 
const router = express.Router();

//create post route
router.post('/create-post', requireSignIn, createPostController);

//get all post 
router.get('/get-all-post', getAllPosts);

//get user post 
router.get('/get-user-post', requireSignIn, getUserPost);

//delete post 
router.delete('/delete-post/:id', requireSignIn, deleteUserPost);

//update one post 
router.put('/update-post/:id', requireSignIn, updateUserPost);


//router
module.exports = router;