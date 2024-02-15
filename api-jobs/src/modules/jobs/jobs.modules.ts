import { QueryResult } from "pg";
import { CreateJobDto, JobModuleRepository } from "../__dtos__/modules.dtos";
import { BaseModule } from "../base.module";

export class JobsModule extends BaseModule implements JobModuleRepository {
  async createJob({
    companyId,
    title,
    description,
    location,
    notes,
  }: CreateJobDto): Promise<void> {
    const sql = `
      insert into jobs (
        company_id,
        title,
        description,
        location,
        notes
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      );
    `;
    await this.executeQuery(sql, [
      companyId,
      title,
      description,
      location,
      notes,
    ]);
  }

  async archiveJob(jobId: string): Promise<void> {
    const sql = `
      update jobs set status = 'archived'::job_status, updated_at = NOW() where id = $1;
    `;

    await this.executeQuery(sql, [jobId]);
  }
  async deleteJob(jobId: string): Promise<QueryResult<any>> {
    const sql = `
      delete from jobs where id = $1
    `;

    return await this.executeQuery(sql, [jobId]);
  }
}
