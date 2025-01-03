import { NextFunction, Request, Response } from 'express';
import companyService from '../services/company.service';

export const getAllCompanies = async (req:Request, res:Response, next: NextFunction) => {
    const response = await companyService.getAllCompanies();

    next(response);
};

export const getAllCompanyById = async (req:Request, res:Response, next: NextFunction) => {
    const { _id } = req.params;
    const response = await companyService.getCompaniesById(_id);

    next(response);
};

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        location,
        linkedInProfile,
        emails,
        phoneNumbers,
        comments,
        communicationPeriodicity,
        isHighlightDisabled
    } = req.body;

    const response = await companyService.createCompany({
        name,
        location,
        linkedInProfile,
        emails,
        phoneNumbers,
        comments,
        communicationPeriodicity,
        isHighlightDisabled: isHighlightDisabled || false
    });

    next(response);
};

export const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const {
        name,
        location,
        linkedInProfile,
        emails,
        phoneNumbers,
        comments,
        communicationPeriodicity,
        isHighlightDisabled
    } = req.body;

    const response = await companyService.updateCompany( _id, {
        name,
        location,
        linkedInProfile,
        emails,
        phoneNumbers,
        comments,
        communicationPeriodicity,
        isHighlightDisabled: isHighlightDisabled || false
    });

    next(response);
};

export const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const response = await companyService.deleteCompany(_id);

    next(response);
};

export const toggleHighlight = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const response = await companyService.toggleHighlight(_id);

    next(response);
};