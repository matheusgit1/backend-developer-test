import { PoolClient } from "pg";
import { CompanyModuleRepository } from "../__dtos__/modules.dtos";
import { BaseModule } from "../base.module";

export class CompanyModule
  extends BaseModule
  implements CompanyModuleRepository
{
  constructor() {
    super(CompanyModule.name);
  }
  async getCompanies(): Promise<Array<any>> {
    const sql = `
      select * from companies
    `;
    const { rows } = await this.executeQuery(sql);
    return rows;
  }

  async getCompanyById(id: string): Promise<Array<any>> {
    const sql = `
      select * from companies where id = $1
    `;

    const { rows } = await this.executeQuery(sql, [id]);
    return rows;
  }
}
