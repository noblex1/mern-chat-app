import express from 'express';
import {
  signUp,
  signIn,
  signOut,        // Renamed from signOut
  getMe,
  updateProfile
} from '../controllers/auth.controllers.js';
import auth from '../middleware/auth.middleware.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/signUp', signUp);
authRouter.post('/signIn', signIn);

// Protected routes
authRouter.post('/signOut', auth, signOut);
authRouter.get('/me', auth, getMe);
authRouter.put('/updateProfile', auth, updateProfile);

export default authRouter;
