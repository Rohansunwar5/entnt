import communicationMethodModel, { ICommunicationMethod } from '../models/communicationMethod.model';

export class CommunicationMethod {
  private _model = communicationMethodModel;

  async getAllMethods(): Promise<ICommunicationMethod[]> {
    return this._model
        .find()
        .sort({ sequence: 1 })
        .select('_id name description sequence isMandatory')
        .lean() as Promise<ICommunicationMethod[]>;
}

async getMethodById(_id: string): Promise<ICommunicationMethod | null> {
    return this._model
        .findById(_id)
        .select('_id name description sequence isMandatory')
        .lean() as Promise<ICommunicationMethod | null>;
}

async getMethodBySequence(sequence: number): Promise<ICommunicationMethod | null> {
    return this._model
        .findOne({ sequence })
        .select('_id name description sequence isMandatory')
        .lean() as Promise<ICommunicationMethod | null>;
}

async createMethod(methodData: Partial<ICommunicationMethod>): Promise<ICommunicationMethod> {
    const method = new this._model(methodData);
    const savedMethod = await method.save();
    return savedMethod.toObject() as ICommunicationMethod;
}

async updateMethod(_id: string, methodData: Partial<ICommunicationMethod>): Promise<ICommunicationMethod | null> {
    return this._model
        .findByIdAndUpdate(
            _id,
            { $set: methodData },
            { new: true, lean: true }
        )
        .select('_id name description sequence isMandatory') as Promise<ICommunicationMethod | null>;
}
}