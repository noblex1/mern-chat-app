import express from 'express';
import { login, signUp } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post('/signUp', signUp)

authRouter.post('/login', login)

export default authRouter;