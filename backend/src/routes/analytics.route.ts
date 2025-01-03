import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { exportReports, getActivityLog, getCommunicationFrequency, getEffectivenessMetrics, getOverdueTrends } from '../controllers/analytics.controller';

const analyticsRouter = Router();

analyticsRouter.get('/analytics/communication-frequency', isLoggedIn, asyncHandler(getCommunicationFrequency));
analyticsRouter.get('/analytics/effectiveness-metrics', isLoggedIn, asyncHandler(getEffectivenessMetrics));
analyticsRouter.get('/analytics/overdue-trends', isLoggedIn, asyncHandler(getOverdueTrends));
analyticsRouter.get('/analytics/activity-log',isLoggedIn, asyncHandler(getActivityLog));
analyticsRouter.get('/analytics/export-reports',isLoggedIn, asyncHandler(exportReports));

export default analyticsRouter;