import companyModel, { ICompany } from '../models/company.model';

export class CompanyRepository {
  private _model = companyModel;

  async getAllCompanies(): Promise<ICompany[]> {
    return this._model
        .find()
        .select('_id name location linkedInProfile emails phoneNumbers comments communicationPeriodicity isHighlightDisabled');
  }

  async getCompanyById(_id : string){
    return this._model
    .findById(_id)
    .select('_id name location linkedInProfile emails phoneNumbers comments communicationPeriodicity isHighlightDisabled');
  }

  async createCompany(companyData: Partial<ICompany>): Promise<ICompany> {
    const company = new this._model(companyData);
    return await company.save();
  }

  async updateCompany(_id: string, companyData: Partial<ICompany>): Promise<ICompany | null> {
    const updated = await this._model.findByIdAndUpdate(
        _id,
        { $set: companyData },
        { new: true, lean: true }
    ).select('_id name location linkedInProfile emails phoneNumbers comments communicationPeriodicity isHighlightDisabled');

    return updated as ICompany | null;
  }

  async deleteCompany(_id: string): Promise<ICompany | null> {
    return this._model
      .findByIdAndDelete(_id)
      .select('_id name location linkedInProfile emails phoneNumbers comments communicationPeriodicity isHighlightDisabled')
      .lean<ICompany>(); // Ensures the result is a plain JavaScript object with the ICompany shape.
  }

  async updateLastCommunicationDate(
    companyId: string,
    lastCommunicationDate: Date
  ): Promise<ICompany | null> {
    return this._model.findByIdAndUpdate(
      companyId,
      { $set: { lastCommunicationDate } },
      { new: true }
    );
  }
}
