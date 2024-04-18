const postModel = require("../models/postModel");

// create post 
const createPostController = async (req, res) => {
    try {
        const { title, description } = req.body;
        //validate
        if (!title || !description) {
            return res.status(500).send({
                success: false,
                message: "Please Provide All Fields"
            });
        }
        const post = await postModel({
            title,
            description,
            postedBy: req.auth._id
        }).save();

        res.status(201).send({
            success: true,
            message: 'Post Created Successfully',
            post,
        })
        // console.log(req);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in  create post API'
        })
    }
};

//get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find()
            .populate('postedBy', "_id name")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: 'All post data',
            posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in  get all post API'
        })
    }
};

//get user post
const getUserPost = async (req, res) => {
    try {
        const userPosts = await postModel.find({ postedBy: req.auth._id });
        res.status(200).send({
            success: true,
            message: 'user post',
            userPosts
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in  get user post API',
            error
        })
    }
};

const deleteUserPost = async (req, res) => {
    try {
        const { id } = req.params;
        await postModel.findByIdAndDelete({ _id: id });
        res.status(200).send({
            success: true,
            message: 'Yous Post has been deleted Successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in  delete  post API',
            error,
        })
    }
};

const updateUserPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        //.post find 
        const post = await postModel.findById({ _id: req.params.id });
        if (!title || !description) {
            return res.status(500).send({
                success: false,
                message: 'Please Provide post title or description',
            })
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                title: title || post?.title,
                description: description || post?.description
            },
            {
                new: true
            }
        );
        res.status(200).send({
            success: true,
            message: 'post Updated Successfully',
            updatedPost,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in  update  post API',
            error,
        })
    }
};

module.exports = {
    createPostController,
    getAllPosts,
    getUserPost,
    deleteUserPost,
    updateUserPost
};