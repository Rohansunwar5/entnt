import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { createMethod, getAllMethods, updateMethod, updateSequence } from '../controllers/communicationMethod.controller';
import { createCommunication, getCompanyCommunications, getLatestCommunications, getOverdueCommunications, getTodayCommunications } from '../controllers/communicationRecord.controller';

const communicationRouter = Router();

communicationRouter.get('/communication-methods', isLoggedIn, asyncHandler(getAllMethods));
communicationRouter.post('/communication-methods', isLoggedIn, asyncHandler(createMethod));
communicationRouter.put('/communication-methods/:_id', isLoggedIn, asyncHandler(updateMethod));
communicationRouter.patch('/communication-methods/:_id/sequence', isLoggedIn, asyncHandler(updateSequence));
communicationRouter.post('/communication-records', isLoggedIn, asyncHandler(createCommunication));
communicationRouter.get('/communication-records/company/:id', isLoggedIn, asyncHandler(getCompanyCommunications));
communicationRouter.get('/communication-records/latest', isLoggedIn, asyncHandler(getLatestCommunications));
communicationRouter.get('/communication-records/overdue', isLoggedIn, asyncHandler(getOverdueCommunications));
communicationRouter.get('/communication-records/today', isLoggedIn, asyncHandler(getTodayCommunications));


export default communicationRouter;