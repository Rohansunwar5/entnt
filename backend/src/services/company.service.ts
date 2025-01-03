import { CompanyRepository } from '../repository/company.repository';
import { ICompany } from '../models/company.model';
import { NotFoundError } from '../errors/not-found.error';

class CompanyService {
  constructor(private readonly _companyRepository: CompanyRepository) {
  }

  async getAllCompanies() {
    const companies = await this._companyRepository.getAllCompanies();
    return (companies);
  }

  async getCompaniesById(_id: string) {
    const companies = await this._companyRepository.getCompanyById(_id);
    return (companies);
  }

  async createCompany(companyData: Partial<ICompany>) {
    const company = await this._companyRepository.createCompany(companyData);
    return company;
  }

  async updateCompany(_id: string, companyData: Partial<ICompany>) {
    const updatedCompany = await this._companyRepository.updateCompany(_id, companyData);
    return updatedCompany;
  }

  async deleteCompany(_id: string) {
    const deletedCompany = await this._companyRepository.deleteCompany(_id);
    if (!deletedCompany) {
        throw new NotFoundError(`Company with ID ${_id} not found.`);
    }

    return deletedCompany;
  }

  async toggleHighlight(_id: string) {
    const company = await this._companyRepository.getCompanyById(_id);
    if (!company) {
        throw new NotFoundError(`Company with ID ${_id} not found.`);
    }

    company.isHighlightDisabled = !company.isHighlightDisabled;
    return await this._companyRepository.updateCompany(_id, { isHighlightDisabled: company.isHighlightDisabled });
  }

}

export default new CompanyService(new CompanyRepository());