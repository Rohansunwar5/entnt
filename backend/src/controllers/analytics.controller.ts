import { NextFunction, Request, Response } from 'express';
import analyticsService from '../services/analytics.service';

export const getCommunicationFrequency = async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate, companyId } = req.query;
    const response = await analyticsService.getCommunicationFrequency(
        startDate as string,
        endDate as string,
        companyId as string
    );
    next(response);
};

export const getEffectivenessMetrics = async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate, companyId } = req.query;
    const response = await analyticsService.getEffectivenessMetrics(
        startDate as string,
        endDate as string,
        companyId as string
    );
    next(response);
};

export const getOverdueTrends = async (req: Request, res: Response, next: NextFunction) => {
    const { months } = req.query;
    const response = await analyticsService.getOverdueTrends(Number(months) || 6);
    next(response);
};

export const getActivityLog = async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate, limit, skip } = req.query;
    const response = await analyticsService.getActivityLog(
        startDate as string,
        endDate as string,
        Number(limit) || 20,
        Number(skip) || 0
    );
    next(response);
};

export const exportReports = async (req: Request, res: Response, next: NextFunction) => {
    const { type, startDate, endDate } = req.query;
    const response = await analyticsService.exportReports(
        type as string,
        startDate as string,
        endDate as string
    );
    next(response);
};