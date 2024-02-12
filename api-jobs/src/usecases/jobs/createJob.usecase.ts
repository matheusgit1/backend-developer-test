import { PgClienteRepository } from "src/infrastructure/database/pg.repository";
import { BaseUseCase } from "..";
import { PoolClient } from "pg";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class CreateJobUseCase implements BaseUseCase {
  constructor(private readonly pgCliente: PgClienteRepository) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let connection: PoolClient | undefined = undefined;
    try {
      const companyId = req.headers["company_id"];
      const { title, description, location, notes } = req.body;
      if (!title || !description! || !location || !notes) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: '"invalid" parameters',
          },
        };
      }
      if(!companyId){
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: '"company_id" is required',
          },
        };
      }

      const sql = `
        insert into jobs (
          company_id,
          title,
          description,
          location,
          notes
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        );
      `;

      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      await this.pgCliente.executeQuery(connection, sql, [
        companyId,
        title,
        description,
        location,
        notes,
      ]);

      await this.pgCliente.commitTransaction(connection);

      return {
        statusCode: StatusCodes.CREATED,
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
