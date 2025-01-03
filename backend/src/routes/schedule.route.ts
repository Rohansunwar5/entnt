import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import {
    getSchedule,
    createScheduledCommunication,
    updateScheduledCommunication,
    deleteScheduledCommunication
} from '../controllers/schedule.controller';

const scheduleRouter = Router();

scheduleRouter.get('/schedule', isLoggedIn, asyncHandler(getSchedule));
scheduleRouter.post('/schedule', isLoggedIn, asyncHandler(createScheduledCommunication));
scheduleRouter.put('/schedule/:_id', isLoggedIn, asyncHandler(updateScheduledCommunication));
scheduleRouter.delete('/schedule/:_id', isLoggedIn, asyncHandler(deleteScheduledCommunication));

export default scheduleRouter;
