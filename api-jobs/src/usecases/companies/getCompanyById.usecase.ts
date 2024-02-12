import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { BaseUseCase } from "..";
import { PoolClient } from "pg";

export class GetCompanyByIdUseCase implements BaseUseCase {
  constructor(private readonly pgCliente: PgClienteRepository) {}

  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let connection: PoolClient | undefined = undefined;
    try {
      const companyId = req.params["company_id"];
      if (!companyId) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: '"company_id" is required',
          },
        };
      }
      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      const sql = `
        select * from companies where id = $1
      `;

      //TODO - adicionar tratamento para quando o id não existir o recurso
      const { rows } = await this.pgCliente.executeQuery(connection, sql, [
        companyId,
      ]);

      return {
        statusCode: 200,
        body: {
          ...rows[0],
        },
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
