import { QueryResult } from "pg";
import { BaseModuleRepository } from "../base.repository";
import { CompanyEntity } from "../../entities/company/company.entity";
import { JobEntity } from "../../entities/job/job.entity";
import { Job } from "../../entities/__dtos__/entities.dtos";

export interface CreateJobDto {
  companyId: string;
  title: string;
  description: string;
  location: string;
}

export type JobInFeed = Job;

export interface FeedJobs {
  feeds: JobInFeed[];
}
/**
 * @description Modulo responsável pelas ações na base referente as companies
 */
export declare class CompanyModuleRepository extends BaseModuleRepository {
  getCompanies(): Promise<CompanyEntity[]>;
  getCompanyById(id: string): Promise<CompanyEntity>;
}

/**
 * @description Modulo responsável pelas ações na base referente aos jobs
 */
export declare class JobModuleRepository extends BaseModuleRepository {
  createJob(input: CreateJobDto): Promise<void>;
  archiveJob(jobId: string): Promise<void>;
  getJobById(jobId: string): Promise<JobEntity>;
  updateJob(input: Partial<CreateJobDto>, jobId: string): Promise<void>;
}

/**
 * @description Modulo responsável por buscar os feeds
 */
export declare class FeedModuleRepository extends BaseModuleRepository {
  getFeed(): Promise<FeedJobs>;
}
