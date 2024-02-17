import { Logger } from "../../infrastructure/logger/logger";
import * as pg from "pg";
import { AvailableStatusJobs, JobModuleRepository } from "./jobs.repository";

export class JobModule implements JobModuleRepository {
  constructor(private readonly logger: Logger = new Logger(JobModule.name)) {}

  async getJob(cliente: pg.PoolClient, jobId: string): Promise<any> {
    const sql = `
        select * from jobs where id = $1;
      `;

    const { rows } = await cliente.query(sql, [jobId]);
    return rows[0];
  }

  async updateJobStatus(
    cliente: pg.PoolClient,
    jobId: string,
    status: AvailableStatusJobs
  ): Promise<void> {
    const sql = `
      update jobs set status = $1::job_status, updated_at = NOW() where id = $2
    `;
    await cliente.query(sql, [status, jobId]);
  }
}
