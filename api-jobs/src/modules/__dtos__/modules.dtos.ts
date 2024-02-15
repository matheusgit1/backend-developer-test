import { BaseModuleRepository } from "../base.repository";

export interface CreateJobDto {
  companyId: string;
  title: string;
  description: string;
  location: string;
  notes: string;
}
export declare class CompanyModuleRepository extends BaseModuleRepository {
  getCompanies(): Promise<Array<any>>;

  getCompanyById(id: string): Promise<Array<any>>;
}

export declare class JobModuleRepository extends BaseModuleRepository {
  createJob(input: CreateJobDto): Promise<void>;
  archiveJob(jobId: string): Promise<void>;
}
