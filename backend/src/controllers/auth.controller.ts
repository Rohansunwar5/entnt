import { NextFunction, Request, Response } from 'express';
import authService from '../services/auth.service';
// import uploadService from '../services/upload.service';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const response = await authService.login({ email, password, role: 'user' });
  next(response);
};

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const {  email, password } = req.body;
  const response = await authService.login({ email, password, role: 'admin' });

  next(response);
};
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password , role} = req.body;
  const response = await authService.signup({ firstName, lastName, email, password, role });

  next(response);
};



export const profile = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const response = await authService.profile(_id);

  next(response);
};

