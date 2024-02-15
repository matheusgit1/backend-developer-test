import { BaseModuleRepository } from "../base.repository";

export declare class CompanyModuleRepository extends BaseModuleRepository {
  getCompanies(): Promise<Array<any>>;

  getCompanyById(id: string): Promise<Array<any>>;
}
