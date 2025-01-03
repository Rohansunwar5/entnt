import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../errors/unauthorized.error';

const requireAuth = (allowedRoles?: string[]) => (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  
  if (allowedRoles && !allowedRoles.includes(req.user.role)) {
    throw new UnauthorizedError('Access denied');
  }

  next();
};

export default requireAuth;
