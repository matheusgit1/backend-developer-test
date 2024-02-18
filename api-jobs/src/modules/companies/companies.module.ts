import { PoolClient, QueryResult } from "pg";
import { Company, CompanyModuleRepository } from "../__dtos__/modules.dtos";
import { BaseModule } from "../base.module";

export class CompanyModule
  extends BaseModule
  implements CompanyModuleRepository
{
  constructor() {
    super(CompanyModule.name);
  }
  async getCompanies(): Promise<QueryResult<Company>> {
    const sql = `
      select * from companies
    `;
    return await this.executeQuery(sql);
  }

  async getCompanyById(id: string): Promise<QueryResult<Company>> {
    const sql = `
      select * from companies where id = $1
    `;

    return await this.executeQuery(sql, [id]);
  }
}
