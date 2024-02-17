import * as pg from "pg";

export type AvailableStatusJobs =
  | "draft"
  | "published"
  | "archived"
  | "rejected";

export interface JobProperties {
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

export declare class JobModuleRepository {
  getJob(cliente: pg.PoolClient, jobId: string): Promise<JobProperties>;
  updateJobStatus(
    cliente: pg.PoolClient,
    jobId: string,
    status: AvailableStatusJobs
  ): Promise<void>;
}
