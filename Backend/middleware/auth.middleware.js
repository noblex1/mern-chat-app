import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

const auth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.jwt || req.header('Authorization')?.replace('Bearer ', '');

    // Log token for debugging
    console.log('🧪 Token received:', token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from token payload
    const user = await userModel.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found. Authorization denied.' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ message: 'Invalid token. Authorization denied.' });
  }
};

export default auth;
