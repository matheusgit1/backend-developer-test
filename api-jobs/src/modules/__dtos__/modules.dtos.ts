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

export interface JobInFeed {
  id: string;
  company_id: string;
  title: string;
  description: string;
  location: string;
  notes: string;
  status: AvailableStatusJobs;
  created_at: Date;
  updated_at: Date;
}

export interface FeedJobs {
  feeds: JobInFeed[];
}
export declare class CompanyModuleRepository extends BaseModuleRepository {
  getCompanies(): Promise<Array<any>>;

  getCompanyById(id: string): Promise<Array<any>>;
}

export declare class JobModuleRepository extends BaseModuleRepository {
  createJob(input: CreateJobDto): Promise<void>;
  archiveJob(jobId: string): Promise<void>;
  deleteJob(jobId: string): Promise<QueryResult<any>>;
  getJobById(jobId: string): Promise<QueryResult<any>>;
  updateJob(
    input: Partial<CreateJobDto>,
    jobId: string
  ): Promise<QueryResult<any>>;
}

export declare class FeedModuleRepository extends BaseModuleRepository {
  getFeed(): Promise<any>;
}
