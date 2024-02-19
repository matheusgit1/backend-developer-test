import { QueryResult } from "pg";
import { BaseModuleRepository } from "../base.repository";

export interface CreateJobDto {
  companyId: string;
  title: string;
  description: string;
  location: string;
  notes: string;
}

export type AvailableStatusJobs =
  | "draft"
  | "published"
  | "archived"
  | "rejected";

export interface Company {
  id: string;
  name: string;
  created_at: Date | string;
  updated_at: Date | string;
}
export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  location: string;
  notes: string;
  status: AvailableStatusJobs;
  created_at: Date | string;
  updated_at: Date | string;
}
export type JobInFeed = Job;

export interface FeedJobs {
  feeds: JobInFeed[];
}
/**
 * @description Modulo responsável pelas ações na base referente as companies
 */
export declare class CompanyModuleRepository extends BaseModuleRepository {
  getCompanies(): Promise<QueryResult<Company>>;
  getCompanyById(id: string): Promise<QueryResult<Company>>;
}

/**
 * @description Modulo responsável pelas ações na base referente aos jobs
 */
export declare class JobModuleRepository extends BaseModuleRepository {
  createJob(input: CreateJobDto): Promise<void>;
  archiveJob(jobId: string): Promise<void>;
  getJobById(jobId: string): Promise<QueryResult<Job>>;
  updateJob(
    input: Partial<CreateJobDto>,
    jobId: string
  ): Promise<QueryResult<any>>;
}

/**
 * @description Modulo responsável por buscar os feeds
 */
export declare class FeedModuleRepository extends BaseModuleRepository {
  getFeed(): Promise<FeedJobs>;
}
