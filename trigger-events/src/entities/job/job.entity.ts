import { AvailableStatusJobs, Job } from "../__dtos__/entities.dtos";
import { BaseEntity } from "../base.entity";

export class JobEntity implements BaseEntity<Job> {
  private props?: Job;
  private isValid: boolean = false;
  constructor(props?: Job) {
    if (props) {
      this.isValid = true;
    }
    this.props = props;
  }

  getProps(): Job {
    return this.props;
  }

  isValidEntity(): boolean {
    return this.isValid;
  }

  get id(): string {
    return this.props.id;
  }

  get company_id(): string {
    return this.props.company_id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get location(): string {
    return this.props.location;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get status(): AvailableStatusJobs {
    return this.props.status;
  }

  get created_at(): Date | string {
    return this.props.created_at;
  }

  get updated_at(): Date | string {
    return this.props.updated_at;
  }

  set status(status: AvailableStatusJobs) {
    this.props.status = status;
  }

  set updated_at(date: Date | string) {
    this.props.updated_at = date;
  }
}
