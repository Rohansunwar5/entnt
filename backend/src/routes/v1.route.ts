import { Router } from 'express';
import { country, health, helloWorld } from '../controllers/health.controller';
import { asyncHandler } from '../utils/asynchandler';
import authRouter from './auth.route';
import contactRouter from './contact.route';
import communicationRouter from './communication.route';
import companyRouter from './company.route';
import analyticsRouter from './analytics.route';
import scheduleRouter from './schedule.route';

const v1Router = Router();

v1Router.get('/', asyncHandler(helloWorld));
v1Router.get('/health', asyncHandler(health));
v1Router.use('/auth', authRouter);
v1Router.use('/contact', contactRouter);
v1Router.use('/company', companyRouter);
v1Router.use('/analytics', analyticsRouter);
v1Router.use('/schedule', scheduleRouter);
v1Router.use('/communication', communicationRouter);
v1Router.get('/country', asyncHandler(country));

export default v1Router;
