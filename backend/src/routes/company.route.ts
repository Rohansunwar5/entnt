import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import {
    getAllCompanies,
    getAllCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    toggleHighlight
} from '../controllers/company.controller';

const companyRouter = Router();

companyRouter.get('/companies', isLoggedIn, asyncHandler(getAllCompanies));
companyRouter.get('/companies/:_id', isLoggedIn, asyncHandler(getAllCompanyById));
companyRouter.post('/companies', isLoggedIn, asyncHandler(createCompany));
companyRouter.put('/companies/:_id', isLoggedIn, asyncHandler(updateCompany));
companyRouter.delete('/companies/:_id', isLoggedIn, asyncHandler(deleteCompany));
companyRouter.patch('/companies/:_id/highlight', isLoggedIn, asyncHandler(toggleHighlight));

export default companyRouter;
