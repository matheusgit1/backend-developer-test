import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { BaseUseCase } from "..";
import { PoolClient } from "pg";

export class GetCompaniesUseCase implements BaseUseCase {
  constructor(private readonly pgCliente: PgClienteRepository) {}

  public async handler(): Promise<HttpResponse> {
    let connection: PoolClient | undefined = undefined;
    try {
      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      const sql = `
        select * from companies
      `;

      const { rows } = await this.pgCliente.executeQuery(connection, sql);

      return {
        statusCode: StatusCodes.OK,
        body: rows.map((row) => ({
          id: row.id,
          name: row.name,
        })),
      };
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }
}
