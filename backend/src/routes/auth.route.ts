import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { loginAdmin, loginUser, profile, signup} from '../controllers/auth.controller';
import {loginValidator, signupValidator} from '../middlewares/validators/auth.validator';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';

const authRouter = Router();

authRouter.post('/login', loginValidator, asyncHandler(loginUser));
authRouter.post('/login/user', loginValidator, asyncHandler(loginAdmin));
authRouter.post('/signup', signupValidator, asyncHandler(signup));
authRouter.get('/profile', isLoggedIn, asyncHandler(profile));


export default authRouter;