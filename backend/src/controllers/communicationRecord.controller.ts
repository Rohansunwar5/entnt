import { NextFunction, Request, Response } from 'express';
import communicationRecordService from '../services/communicationRecord.service';

export const createCommunication = async (req: Request, res: Response, next: NextFunction) => {
    const {
        company,
        methodUsed,
        date,
        notes,
        performedBy
    } = req.body;

    const response = await communicationRecordService.createCommunication({
        company,
        methodUsed,
        date: new Date(date),
        notes,
        performedBy
    });
    next(response);
};

export const getCompanyCommunications = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { limit, skip } = req.query;

    const response = await communicationRecordService.getCompanyCommunications(
        id,
        Number(limit) || 10,
        Number(skip) || 0
    );
    next(response);
};

export const getLatestCommunications = async (req: Request, res: Response, next: NextFunction) => {
    const { limit } = req.query;
    const response = await communicationRecordService.getLatestCommunications(Number(limit) || 5);
    next(response);
};

export const getOverdueCommunications = async (req: Request, res: Response, next: NextFunction) => {
    const response = await communicationRecordService.getOverdueCommunications();
    next(response);
};

export const getTodayCommunications = async (req: Request, res: Response, next: NextFunction) => {
    const response = await communicationRecordService.getTodayCommunications();
    next(response);
};