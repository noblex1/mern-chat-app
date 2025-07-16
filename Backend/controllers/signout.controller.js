// controllers/authController.js
import userModel from '../models/user.model.js';
import auth from '../middleware/auth.middleware.js';

export const logout = async (req, res) => {
  try {
    // Update user's online status to false
    await userModel.findByIdAndUpdate(req.user._id, {
      isOnline: false,
    });

    // Clear the JWT cookie
    res.cookie('jwt', '', {
      maxAge: 0, // Expire the cookie immediately
      httpOnly: true, 
      sameSite: 'strict', // Ensure the cookie is sent only in same-site requests
      secure: process.env.NODE_ENV === 'production', 
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message,
    });
  }
};

export default signOut;