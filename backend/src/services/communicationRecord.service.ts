import { ICommunicationRecord } from '../models/communicationRecord.mode';
import { CommunicationRecordRepository } from '../repository/communicationRecord.repository';
import { CompanyRepository } from '../repository/company.repository';

class CommunicationRecordService {
    constructor(
        private readonly _communicationRecordRepository: CommunicationRecordRepository,
        private readonly _companyRepository: CompanyRepository
    ) {}

    async createCommunication(communicationData: Partial<ICommunicationRecord>) {
        if (!communicationData.company || !communicationData.date) {
            throw new Error('Company and date are required to create a communication record.');
        }

        const record = await this._communicationRecordRepository.createCommunication(communicationData);

        // Ensure company is converted to a string
        const companyId = communicationData.company.toString();

        // Update company's last communication date
        await this._companyRepository.updateLastCommunicationDate(
            companyId,
            communicationData.date
        );

        return record;
    }

    async getCompanyCommunications(companyId: string, limit: number, skip: number) {
        const records = await this._communicationRecordRepository.getCompanyCommunications(
            companyId,
            limit,
            skip
        );
        return records;
    }

    async getLatestCommunications(limit: number) {
        const records = await this._communicationRecordRepository.getLatestCommunications(limit);
        return records;
    }

    async getOverdueCommunications() {
        // Get all companies
        const companies = await this._companyRepository.getAllCompanies();
        const overdueCommunications = [];

        for (const company of companies) {
            const lastCommunication = await this._communicationRecordRepository.getLastCommunication(company._id);

            if (!lastCommunication) {
                // If no communication exists, it's overdue
                overdueCommunications.push({
                    company,
                    daysOverdue: this.calculateDaysOverdue(null, company.communicationPeriodicity)
                });
                continue;
            }

            const daysOverdue = this.calculateDaysOverdue(
                lastCommunication.date,
                company.communicationPeriodicity
            );

            if (daysOverdue > 0) {
                overdueCommunications.push({
                    company,
                    lastCommunication,
                    daysOverdue
                });
            }
        }

        return overdueCommunications;
    }

    async getTodayCommunications() {
        const companies = await this._companyRepository.getAllCompanies();
        const todayCommunications = [];

        for (const company of companies) {
            const lastCommunication = await this._communicationRecordRepository.getLastCommunication(company._id);

            if (!lastCommunication) {
                todayCommunications.push({ company });
                continue;
            }

            const daysUntilNext = this.calculateDaysUntilNext(
                lastCommunication.date,
                company.communicationPeriodicity
            );

            if (daysUntilNext === 0) {
                todayCommunications.push({
                    company,
                    lastCommunication
                });
            }
        }

        return todayCommunications;
    }

    private calculateDaysOverdue(lastCommunicationDate: Date | null, periodicity: number): number {
        if (!lastCommunicationDate) return periodicity;

        const today = new Date();
        const nextDueDate = new Date(lastCommunicationDate);
        nextDueDate.setDate(nextDueDate.getDate() + periodicity);

        const diffTime = today.getTime() - nextDueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    }

    private calculateDaysUntilNext(lastCommunicationDate: Date, periodicity: number): number {
        const today = new Date();
        const nextDueDate = new Date(lastCommunicationDate);
        nextDueDate.setDate(nextDueDate.getDate() + periodicity);

        const diffTime = nextDueDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}


export default new CommunicationRecordService(
    new CommunicationRecordRepository(),
    new CompanyRepository()
);