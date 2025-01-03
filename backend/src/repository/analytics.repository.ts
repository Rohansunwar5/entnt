import mongoose from 'mongoose';
import communicationRecordMode from '../models/communicationRecord.mode';

export class AnalyticsRepository {
    private _communicationModel = communicationRecordMode;

    async getCommunicationFrequency(
        startDate: Date,
        endDate: Date,
        companyId?: string
    ): Promise<any[]> {
        const match: any = {
            date: { $gte: startDate, $lte: endDate }
        };
        if (companyId) match.company = new mongoose.Types.ObjectId(companyId);

        return this._communicationModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        method: '$methodUsed',
                        month: { $month: '$date' },
                        year: { $year: '$date' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'communicationmethods',
                    localField: '_id.method',
                    foreignField: '_id',
                    as: 'method'
                }
            },
            { $unwind: '$method' },
            {
                $project: {
                    method: '$method.name',
                    period: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            { $toString: '$_id.month' }
                        ]
                    },
                    count: 1
                }
            },
            { $sort: { period: 1, 'method.sequence': 1 } }
        ]);
    }

    async getEffectivenessMetrics(
        startDate: Date,
        endDate: Date,
        companyId?: string
    ): Promise<any[]> {
        const match: any = {
            date: { $gte: startDate, $lte: endDate }
        };
        if (companyId) match.company = new mongoose.Types.ObjectId(companyId);

        return this._communicationModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$methodUsed',
                    count: { $sum: 1 },
                    avgResponseTime: { $avg: '$responseTime' }
                }
            },
            {
                $lookup: {
                    from: 'communicationmethods',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'method'
                }
            },
            { $unwind: '$method' },
            {
                $project: {
                    method: '$method.name',
                    count: 1,
                    avgResponseTime: 1
                }
            },
            { $sort: { 'method.sequence': 1 } }
        ]);
    }

    async getOverdueTrends(startDate: Date, endDate: Date): Promise<any[]> {
        return this._communicationModel.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        company: '$company',
                        week: { $week: '$date' },
                        year: { $year: '$date' }
                    },
                    lastCommunication: { $max: '$date' }
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: '_id.company',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            { $unwind: '$company' },
            {
                $project: {
                    period: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-W',
                            { $toString: '$_id.week' }
                        ]
                    },
                    isOverdue: {
                        $gt: [
                            { $subtract: ['$lastCommunication', new Date()] },
                            { $multiply: ['$company.communicationPeriodicity', 24 * 60 * 60 * 1000] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$period',
                    overdueCount: {
                        $sum: { $cond: ['$isOverdue', 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);
    }

    async getActivityLog(
        startDate: Date,
        endDate: Date,
        limit: number,
        skip: number
    ): Promise<any[]> {
        return this._communicationModel
            .find({
                date: { $gte: startDate, $lte: endDate }
            })
            .populate('company', 'name')
            .populate('methodUsed', 'name')
            .populate('performedBy', 'name')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }

    async getActivityCount(startDate: Date, endDate: Date): Promise<number> {
        return this._communicationModel.countDocuments({
            date: { $gte: startDate, $lte: endDate }
        });
    }
}