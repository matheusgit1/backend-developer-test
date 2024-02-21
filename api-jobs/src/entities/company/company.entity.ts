import { Company } from "../__dtos__/entities.dtos";

export class CompanyEntity {
  private props?: Company;
  private isValid: boolean = false;
  constructor(props?: Company) {
    if (props) {
      this.isValid = true;
    }
    this.props = props;
  }
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get created_at(): Date | string {
    return this.props.created_at;
  }

  get updated_at(): Date | string {
    return this.props.updated_at;
  }

  getProps(): Company | undefined {
    return this.props;
  }

  isValidEntity(): boolean {
    return this.isValid;
  }
}
