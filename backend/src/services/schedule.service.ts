import { IScheduledCommunication } from '../models/scheduledCommunication.model';
import { ScheduleRepository } from '../repository/scheduledCommunication.repository';

class ScheduleService {
    constructor(private readonly _scheduleRepository: ScheduleRepository) {}

    async getSchedule(startDate?: string, endDate?: string) {
        const query: any = {};

        if (startDate || endDate) {
            query.scheduledDate = {};
            if (startDate) query.scheduledDate.$gte = new Date(startDate);
            if (endDate) query.scheduledDate.$lte = new Date(endDate);
        }

        const schedules = await this._scheduleRepository.getSchedule(query);
        return schedules;
    }

    async createScheduledCommunication(scheduleData: Partial<IScheduledCommunication>) {
        if (!scheduleData.company || !scheduleData.scheduledDate) {
            throw new Error('Company and scheduled date are required to create a scheduled communication.');
        }

        // Convert company ObjectId to string
        const companyId = scheduleData.company.toString();

        // Check if there's already a scheduled communication for the same company on the same date
        const existingSchedule = await this._scheduleRepository.findConflictingSchedule(
            companyId,
            scheduleData.scheduledDate
        );

        if (existingSchedule) {
            throw new Error('A communication is already scheduled for this company on this date');
        }

        const schedule = await this._scheduleRepository.createScheduledCommunication(scheduleData);
        return schedule;
    }

    async updateScheduledCommunication(_id: string, scheduleData: Partial<IScheduledCommunication>) {
        // If date is being updated, check for conflicts
        if (scheduleData.scheduledDate) {
            const existingSchedule = await this._scheduleRepository.getScheduleById(_id);
            if (existingSchedule) {
                const conflict = await this._scheduleRepository.findConflictingSchedule(
                    existingSchedule.company.toString(),
                    scheduleData.scheduledDate,
                    _id
                );
                if (conflict) {
                    throw new Error('A communication is already scheduled for this company on this date');
                }
            }
        }

        const schedule = await this._scheduleRepository.updateScheduledCommunication(_id, scheduleData);
        return schedule;
    }

    async deleteScheduledCommunication(_id: string) {
        const schedule = await this._scheduleRepository.deleteScheduledCommunication(_id);
        return schedule;
    }
}

export default new ScheduleService(new ScheduleRepository());