import * as pg from "pg";

export type AvailableStatusJobs =
  | "draft"
  | "published"
  | "archived"
  | "rejected";

export interface JobAtributtes {
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

export declare class BaseModuleRepository {
  name: string;
  connection: pg.PoolClient;
  executeQuery(query: string, params?: any[]): Promise<pg.QueryResult<any>>;
}

export declare class JobModuleRepository extends BaseModuleRepository {
  getJob(jobId: string): Promise<pg.QueryResult<JobAtributtes>>;
  updateJobStatus(jobId: string, status: AvailableStatusJobs): Promise<void>;
  deleteJob(jobId: string): Promise<void>;
}