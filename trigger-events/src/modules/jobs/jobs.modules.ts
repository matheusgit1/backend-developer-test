import { Logger } from "../../infrastructure/logger/logger";
import * as pg from "pg";
import { BaseModule } from "../base.module";
import {
  AvailableStatusJobs,
  JobModuleRepository,
} from "../__dtos__/modules.dtos";

export class JobModule extends BaseModule implements JobModuleRepository {
  constructor(private readonly logger: Logger = new Logger(JobModule.name)) {
    super(JobModule.name);
  }

  async getJob(jobId: string): Promise<pg.QueryResult<any>> {
    const sql = `
        select * from jobs where id = $1;
      `;

    return await this.executeQuery(sql, [jobId]);
  }

  async updateJobStatus(
    jobId: string,
    status: AvailableStatusJobs
  ): Promise<void> {
    const sql = `
      update jobs set status = $1::job_status, updated_at = NOW() where id = $2
    `;
    await this.executeQuery(sql, [status, jobId]);
  }

  async deleteJob(jobId: string): Promise<void> {
    const sql = `
      delete from jobs where id = $1
    `;

    await this.executeQuery(sql, [jobId]);
  }
}
