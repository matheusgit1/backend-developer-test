import { CompanyModuleRepository } from "../__dtos__/modules.dtos";
import { BaseModule } from "../base.module";
import { CompanyEntity } from "../../entities/company/company.entity";
import { Company } from "../../entities/__dtos__/entities.dtos";

export class CompanyModule
  extends BaseModule
  implements CompanyModuleRepository
{
  constructor() {
    super(CompanyModule.name);
  }
  async getCompanies(): Promise<CompanyEntity[]> {
    const sql = `
      select * from companies
    `;

    const { rows } = await this.executeQuery<Company>(sql);

    return rows.map((row) => new CompanyEntity({ ...row }));
  }

  async getCompanyById(id: string): Promise<CompanyEntity> {
    const sql = `
      select * from companies where id = $1
    `;

    const { rows } = await this.executeQuery<Company>(sql, [id]);

    return new CompanyEntity({ ...rows[0] });
  }
}
