import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';
import generateJWT from '../lib/generateJWT.js';

// Sign Up - Register New User
export const signUp = async (req, res) => {
  const { username, email, password, avatar} = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      avatar
    });

    const savedUser = await newUser.save();
    const token = generateJWT(savedUser._id, res);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        avatar: savedUser.avatar,
        isOnline: savedUser.isOnline
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Sign In - Login User
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    user.isOnline = true;
    await user.save();

    const token = generateJWT(user._id, res);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline
      }
    });
    // 5️⃣ Create and save new user
    const newUser = new userModel({
      username,
      email,
      password: hashPassword,
      avatar,
      location: {
        country: location?.country || "",
        city: location?.city || "",
        houseAddress: location?.houseAddress || ""
      }
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        location: newUser.location
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


// Logout User
export const signOut = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.user._id, { isOnline: false });

    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};


// Get Authenticated User Info
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user information',
      error: error.message
    });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  
  const { username, email, avatar, location, relationshipStatus, dateOfBirth  } = req.body;

  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    if (location) updateData.location = location;
    if (relationshipStatus) updateData.relationshipStatus = relationshipStatus;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    const existingUser = await userModel.findOne({
      _id: { $ne: req.user._id },
      $or: [
        username ? { username } : {},
        email ? { email } : {}
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
};
