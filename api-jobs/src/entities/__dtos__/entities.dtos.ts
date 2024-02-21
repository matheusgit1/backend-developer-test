export interface Company {
  id: string;
  name: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export type AvailableStatusJobs =
  | "draft"
  | "published"
  | "archived"
  | "rejected";

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  location: string;
  notes?: string;
  status: AvailableStatusJobs;
  created_at: Date | string;
  updated_at: Date | string;
}
