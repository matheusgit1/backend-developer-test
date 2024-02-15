import { PgCliente } from "../../infrastructure/database/client/database.repository";
import { CompanyModuleRepository } from "../__dtos__/modules.dtos";
import { BaseModule } from "../base.module";
import { BaseModuleRepository } from "../base.repository";

export class CompanyModule
  extends BaseModule
  implements CompanyModuleRepository
{
  constructor() {
    super(new PgCliente());
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
