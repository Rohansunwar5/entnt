import scheduledCommunicationModel, { IScheduledCommunication } from '../models/scheduledCommunication.model';

export class ScheduleRepository {
    private _model = scheduledCommunicationModel;

    async getSchedule(query: any): Promise<IScheduledCommunication[]> {
        return this._model
            .find(query)
            .populate('company', 'name')
            .populate('plannedMethod', 'name')
            .sort({ scheduledDate: 1 })
            .lean() as Promise<IScheduledCommunication[]>;
    }

    async getScheduleById(_id: string): Promise<IScheduledCommunication | null> {
        return this._model
            .findById(_id)
            .lean() as Promise<IScheduledCommunication | null>;
    }

    async findConflictingSchedule(
        company: string,
        scheduledDate: Date,
        excludeId?: string
    ): Promise<IScheduledCommunication | null> {
        const startOfDay = new Date(scheduledDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(scheduledDate);
        endOfDay.setHours(23, 59, 59, 999);

        const query: any = {
            company,
            scheduledDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        };

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        return this._model
            .findOne(query)
            .lean() as Promise<IScheduledCommunication | null>;
    }

    async createScheduledCommunication(scheduleData: Partial<IScheduledCommunication>): Promise<IScheduledCommunication> {
        const schedule = new this._model(scheduleData);
        const savedSchedule = await schedule.save();
        return savedSchedule.toObject() as IScheduledCommunication;
    }

    async updateScheduledCommunication(_id: string, scheduleData: Partial<IScheduledCommunication>): Promise<IScheduledCommunication | null> {
        return this._model
            .findByIdAndUpdate(
                _id,
                { $set: scheduleData },
                { new: true, lean: true }
            )
            .populate('company', 'name')
            .populate('plannedMethod', 'name') as Promise<IScheduledCommunication | null>;
    }

    async deleteScheduledCommunication(_id: string): Promise<IScheduledCommunication | null> {
        return this._model
            .findByIdAndDelete(_id)
            .lean() as Promise<IScheduledCommunication | null>;
    }
}