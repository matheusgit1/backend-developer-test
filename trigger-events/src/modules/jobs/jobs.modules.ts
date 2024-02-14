import { JobsDBAbstractions } from "../../db-abstractions/jobs/jobs.abstractions";

export class JobModule {
  constructor(private readonly jobsAabstractions: JobsDBAbstractions) {}

  async getJob(id: string): Promise<any> {
    const job = await this.jobsAabstractions.getJobById(id);
  }
}
