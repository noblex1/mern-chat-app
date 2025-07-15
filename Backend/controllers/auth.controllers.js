import bcrypt from 'bcrypt'
import userModel from '../models/user.model.js';
import express from 'express';

// Create router
const router = express.Router();


export const signUp = async (req, res) => {
    const {username, email, password, avatar} = req.body;
    try{
        //Validate data
        if (!username || !email || !password){
            return res.status(400).json({message: "Please fill all fields"})
        }

        //Validate password length
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        //Encrypt the password using bycrypt
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);

        if (!hashPassword){
            return res.status(404).json({
                message: "Password hashing failed"
            })
        }

        //check if user exist already
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        //create new user
        const newUser = new userModel({
            username,
            email,
            password: hashPassword,
            avatar
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                userName: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar

            }
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "internal server error",
            error: error.message

        })
    }
    
};

// Login route - POST /api/auth/login
export const login =  async (req, res) => {
  try {
    // Get login data from request
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user by email
    const user = await user.findOne({ email: email });
    
    // If user doesn't exist
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Update user's online status
    user.isOnline = true;
    await user.save();
    
    // Generate JWT token and set cookie
    const token = generateJWT(user._id, res);
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};