
import { CommunicationMethod } from '../repository/communicationMethod.repository';
import { ICommunicationMethod } from '../models/communicationMethod.model';

class CommunicationMethodService {
  constructor(private readonly _communicationMethodRepository: CommunicationMethod) {
  }
  async getAllMethods() {
    const methods = await this._communicationMethodRepository.getAllMethods();
    return methods;
}

async createMethod(methodData: Partial<ICommunicationMethod>) {
    const method = await this._communicationMethodRepository.createMethod(methodData);
    return method;
}

async updateMethod(_id: string, methodData: Partial<ICommunicationMethod>) {
    const method = await this._communicationMethodRepository.updateMethod(_id, methodData);
    return method;
}

async updateSequence(_id: string, newSequence: number) {
    // Get current method
    const currentMethod = await this._communicationMethodRepository.getMethodById(_id);
    if (!currentMethod) {
        throw new Error('Method not found');
    }

    // Get method at target sequence
    const methodAtSequence = await this._communicationMethodRepository.getMethodBySequence(newSequence);
    if (methodAtSequence) {
        // Swap sequences
        await this._communicationMethodRepository.updateMethod(
            methodAtSequence._id,
            { sequence: currentMethod.sequence }
        );
    }

    // Update current method sequence
    const updatedMethod = await this._communicationMethodRepository.updateMethod(_id, {
        sequence: newSequence
    });
    return updatedMethod;
}


}

export default new CommunicationMethodService (new CommunicationMethod());