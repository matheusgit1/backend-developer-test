import { CreateJobDto, JobModuleRepository } from "../__dtos__/modules.dtos";
import { BaseModule } from "../base.module";
import { JobEntity } from "../../entities/job/job.entity";
import { Job } from "src/entities/__dtos__/entities.dtos";

export class JobsModule extends BaseModule implements JobModuleRepository {
  constructor() {
    super(JobsModule.name);
  }
  async createJob({
    companyId,
    title,
    description,
    location,
  }: CreateJobDto): Promise<void> {
    const sql = `
      insert into jobs (
        company_id,
        title,
        description,
        location
      ) VALUES (
        $1,
        $2,
        $3,
        $4
      );
    `;
    await this.executeQuery(sql, [companyId, title, description, location]);
  }

  async archiveJob(jobId: string): Promise<void> {
    const sql = `
      update jobs set status = 'archived'::job_status, updated_at = NOW() where id = $1;
    `;

    await this.executeQuery(sql, [jobId]);
  }

  async getJobById(jobId: string): Promise<JobEntity> {
    const sql = `SELECT * FROM jobs WHERE id = $1;`;
    const { rows } = await this.executeQuery<Job>(sql, [jobId]);
    return new JobEntity(rows[0]);
  }

  async updateJob(
    {
      title,
      description,
      location,
      notes,
    }: Partial<CreateJobDto & { notes: string }>,
    jobId: string
  ): Promise<void> {
    let sqlBase = "update jobs set ";
    let params = [];

    if (title) {
      params.push(title);
      sqlBase += `title = $${params.length},`;
    }

    if (description) {
      params.push(description);
      sqlBase += ` description = $${params.length},`;
    }

    if (location) {
      params.push(location);
      sqlBase += ` location = $${params.length},`;
    }

    if (notes) {
      params.push(notes);
      sqlBase += ` notes = $${params.length},`;
    }

    sqlBase += `  updated_at = NOW(),`;

    sqlBase = sqlBase.slice(0, -1);

    params.push(jobId);
    sqlBase += ` where id = $${params.length}`;

    await this.executeQuery<Job>(sqlBase, params);
  }
}
