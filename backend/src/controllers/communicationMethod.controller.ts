import { NextFunction, Request, Response } from 'express';
import communicationMethodService from '../services/communicationMethod.service';

export const getAllMethods = async (req: Request, res: Response, next: NextFunction) => {
    const response = await communicationMethodService.getAllMethods();
    next(response);
};

export const createMethod = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, sequence, isMandatory } = req.body;
    const response = await communicationMethodService.createMethod({
        name,
        description,
        sequence,
        isMandatory: isMandatory || false
    });
    next(response);
};

export const updateMethod = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { name, description, isMandatory } = req.body;
    const response = await communicationMethodService.updateMethod(_id, {
        name,
        description,
        isMandatory
    });
    next(response);
};

export const updateSequence = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { sequence } = req.body;
    const response = await communicationMethodService.updateSequence(_id, sequence);
    next(response);
};