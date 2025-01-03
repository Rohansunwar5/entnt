import communicationRecordModel, { ICommunicationRecord } from '../models/communicationRecord.mode';


export class CommunicationRecordRepository {
    private _model = communicationRecordModel;

    async createCommunication(communicationData: Partial<ICommunicationRecord>): Promise<ICommunicationRecord> {
        const record = new this._model(communicationData);
        const savedRecord = await record.save();
        return savedRecord.toObject() as ICommunicationRecord;
    }

    async getCompanyCommunications(companyId: string, limit: number, skip: number): Promise<ICommunicationRecord[]> {
        return this._model
            .find({ company: companyId })
            .populate('methodUsed', 'name')
            .populate('performedBy', 'name')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean() as Promise<ICommunicationRecord[]>;
    }

    async getLatestCommunications(limit: number): Promise<ICommunicationRecord[]> {
        return this._model
            .find()
            .populate('company', 'name')
            .populate('methodUsed', 'name')
            .populate('performedBy', 'name')
            .sort({ date: -1 })
            .limit(limit)
            .lean() as Promise<ICommunicationRecord[]>;
    }

    async getLastCommunication(companyId: string): Promise<ICommunicationRecord | null> {
        return this._model
            .findOne({ company: companyId })
            .sort({ date: -1 })
            .lean() as Promise<ICommunicationRecord | null>;
    }
}
