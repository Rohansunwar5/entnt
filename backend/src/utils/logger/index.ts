import developmentLogger from './development';
import { Request } from 'express-validator/src/base';

export interface LogDataJSON {
  ip: string;
  userId: string;
  path: string;
  body: string;
  params: string;
  query: string;
  method: string;
  PID: number;
}

export const getLogDataFromReqObject = (req: Request): string => {
  try {
    if (!req) return '(request object data Not Found)';
    const ip = req.headers?.['x-forwarded-for'] || req.ip || req.socket['remoteAddress'];
    const userId = req.user?._id || 'Anonymous';
    const path = req.path;
    const params = JSON.stringify(req.params);
    const query = JSON.stringify(req.query);
    const body = { ...req.body };

    // Remove sensitive fields
    ['password', 'secretKey', 'confirmPassword', 'token', 'penpencilToken', 'authProviderToken', 'g-recaptcha-response'].forEach((key) => {
      delete body[key];
    });

    return `IP - ${ip}, UserId - ${userId}, Path - ${path}, Body - ${JSON.stringify(body)}, Params - ${params}, Query - ${query}, PID - ${process.pid}`;
  } catch (error) {
    logger.error(`getLogDataFromReqObject function error - ${error}, PID - ${process.pid}`);
    return '(request object data Not Found)';
  }
};

export const getLogDataInJSONFromReqObject = (req: Request): LogDataJSON => {
  try {
    const ip = req.headers?.['x-forwarded-for'] || req.ip || req.socket['remoteAddress'];
    const userId = req.user?._id || 'Anonymous';
    const path = req.path;
    const params = JSON.stringify(req.params);
    const query = JSON.stringify(req.query);
    const method = req.method;
    const body = { ...req.body };

    // Remove sensitive fields
    ['password', 'confirmPassword', 'token', 'g-recaptcha-response'].forEach((key) => {
      delete body[key];
    });

    return {
      ip,
      userId,
      path,
      body: JSON.stringify(body),
      params,
      query,
      method,
      PID: process.pid,
    };
  } catch (error) {
    logger.error(`getLogDataInJSONFromReqObject function error - ${error}, PID - ${process.pid}`);
    throw new Error(`getLogDataInJSONFromReqObject function error - ${error}`);
  }
};

// Always use developmentLogger
const logger = developmentLogger;
export default logger;
