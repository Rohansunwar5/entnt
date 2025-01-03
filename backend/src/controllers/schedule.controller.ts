import { NextFunction, Request, Response } from 'express';
import scheduleService from '../services/schedule.service';

export const getSchedule = async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;
    const response = await scheduleService.getSchedule(
        startDate as string,
        endDate as string
    );
    next(response);
};

export const createScheduledCommunication = async (req: Request, res: Response, next: NextFunction) => {
    const {
        company,
        plannedMethod,
        scheduledDate,
        status = 'pending'
    } = req.body;

    const response = await scheduleService.createScheduledCommunication({
        company,
        plannedMethod,
        scheduledDate: new Date(scheduledDate),
        status
    });
    next(response);
};

export const updateScheduledCommunication = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const {
        plannedMethod,
        scheduledDate,
        status
    } = req.body;

    const response = await scheduleService.updateScheduledCommunication(_id, {
        plannedMethod,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        status
    });
    next(response);
};

export const deleteScheduledCommunication = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const response = await scheduleService.deleteScheduledCommunication(_id);
    next(response);
};
