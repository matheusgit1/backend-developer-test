import { AvailableStatusJobs } from "../../modules/jobs/jobs.repository";

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
