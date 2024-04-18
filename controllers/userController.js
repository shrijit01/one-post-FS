const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
const JWT = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");


// middleware
const requireSignIn = jwt(
    {
        secret: process.env.JWT_SECRET,
        algorithms: ["HS256"]
    }
)


//SIGNUP 
const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'name is required'
            })
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'email is required'
            })
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'password is required and 6 character long'
            })
        }
        const existingUser = await userModel.findOne({ email: email });

        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: "User already registerd with this Mail"
            })
        }

        // hashed password 
        const hashedPassword = await hashPassword(password);

        const user = await userModel({ name, email, password: hashedPassword }).save();

        return res.status(201).send({
            success: true,
            message: 'Registration successful Please Login !'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Register !',
            error,
        })
    }
};


//SIGNIN
const signinController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: 'Please Provide Email and Password',
            })
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(500).send({
                success: false,
                message: 'User Not Found',
            })
        }
        // match password 
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(500).send({
                success: false,
                message: 'Invalid User or Password',
            })
        }
        // TOKEN JWT 
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })

        // undefined password 
        user.password = undefined;

        res.status(200).send({
            success: true,
            message: "Login Successfully",
            token,
            user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Signin !',
            error,
        })
    }
};


//UPDATE
const updateController = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        // user find 
        const user = await userModel.findOne({ email });

        // password validation 
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password is required and  6 character Long"
            })
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;
        // updated user 
        const updatedUser = await userModel.findOneAndUpdate({ email }, {
            name: name || user.name,
            password: hashedPassword || user.password
        }, { new: true });

        updatedUser.password = undefined;

        return res.status(200).send({
            success: true,
            message: "Profile Updated Please Login",
            updatedUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update',
            error
        })
    }
}


module.exports = { requireSignIn, signupController, signinController, updateController };

// // userController.js
// const userModel = require('../models/userModel');

// // Controller function for user signup
// const signupController = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Validation checks
//         if (!name || !email || !password || password.length < 6) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid input. Name, email, and password (at least 6 characters) are required.'
//             });
//         }

//         // Check if user already exists
//         const existingUser = await userModel.findOne({ email: email });
//         if (existingUser) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'User already exists.'
//             });
//         }

//         // Create new user
//         const newUser = new userModel({ name, email, password });
//         await newUser.save();

//         return res.status(201).json({
//             success: true,
//             message: 'User registered successfully. Please log in.'
//         });
//     } catch (error) {
//         console.error('Error in signupController:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'An error occurred while processing your request. Please try again later.'
//         });
//     }
// };

// module.exports = { signupController };

