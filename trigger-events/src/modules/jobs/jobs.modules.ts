import { Logger } from "../../infrastructure/logger/logger";
import { BaseModule } from "../base.module";
import {
  AvailableStatusJobs,
  JobModuleRepository,
} from "../__dtos__/modules.dtos";
import { JobEntity } from "../../entities/job/job.entity";
import { Job } from "../../entities/__dtos__/entities.dtos";

export class JobModule extends BaseModule implements JobModuleRepository {
  constructor(private readonly logger: Logger = new Logger(JobModule.name)) {
    super(JobModule.name);
  }

  async getJob(jobId: string): Promise<JobEntity> {
    const sql = `
        select * from jobs where id = $1;
      `;

    const { rows } = await this.executeQuery<Job>(sql, [jobId]);

    return new JobEntity({ ...rows[0] });
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

  async updateJoNotes(jobId: string, notes: string): Promise<void> {
    const sql = `
      update jobs set notes = $1, updated_at = NOW() where id = $2
    `;

    await this.executeQuery(sql, [notes, jobId]);
  }
}
