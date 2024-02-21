import { Company } from "../__dtos__/entities.dtos";

export class CompanyEntity {
  private props: Company;
  constructor(props: Company) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.id;
  }

  get created_at(): string {
    return this.props.id;
  }

  getProps(): Company {
    return this.props;
  }
}
