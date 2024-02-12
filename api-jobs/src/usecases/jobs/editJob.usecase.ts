import { PgClienteRepository } from "src/infrastructure/database/pg.repository";
import { BaseUseCase } from "..";
import { PoolClient } from "pg";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class EditJobUseCase implements BaseUseCase {
  constructor(private readonly pgCliente: PgClienteRepository) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let connection: PoolClient | undefined = undefined;
    try {
      const jobId = req.params["job_id"];
      if (!jobId) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            error: '"job_id" is required',
          },
        };
      }

      const { title, description, location, notes } = req.body;

      let sqlBase = "update jobs set ";
      let params = [];

      if (title) {
        params.push(title);
        sqlBase += `title = $${params.length},`;
      }

      if (description) {
        params.push(description);
        sqlBase += ` description = $${params.length},`;
      }

      if (location) {
        params.push(location);
        sqlBase += ` location = $${params.length},`;
      }

      if (notes) {
        params.push(notes);
        sqlBase += ` notes = $${params.length},`;
      }

      sqlBase += `  updated_at = NOW(),`;

      sqlBase = sqlBase.slice(0, -1);

      params.push(jobId);
      sqlBase += ` where id = $${params.length}`;

      if (params.length <= 1) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error:
              "at least one parameter must be informed (title, description, location, notes)",
          },
        };
      }

      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);
      const { rowCount } = await this.pgCliente.executeQuery(
        connection,
        "SELECT * FROM jobs WHERE id = $1",
        [jobId]
      );

      if (rowCount < 1) {
        return {
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          body: {
            error: `${jobId} - job_id dos not exist`,
          },
        };
      }

      const [_, { rows }] = await Promise.all([
        this.pgCliente.executeQuery(connection, sqlBase, params),
        this.pgCliente.executeQuery(
          connection,
          `select * from jobs where id = $1 `,
          [jobId]
        ),
      ]);

      await this.pgCliente.commitTransaction(connection);

      // return _res.status().send({ ...rows[0] });
      return {
        statusCode: StatusCodes.OK,
        body: { ...rows[0] },
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
