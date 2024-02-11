import { PoolClient } from "pg";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { CustomEventEmitterClass } from "../../infrastructure/events/dtos/emiter-events.dtos";

export class JobsUseCase {
  constructor(
    private readonly pgCliente: PgClienteRepository,
    private readonly eventEmitter: CustomEventEmitterClass
  ) {}

  public async createJob(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<any> {
    let connection: PoolClient | undefined = undefined;
    try {
      const companyId = _req.headers["company_id"];
      const { title, description, location, notes } = _req.body;
      if (!title || !description! || !location || !notes) {
        throw new Error("invalid parameters");
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

      return _res.status(StatusCodes.CREATED).send();
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message ?? "internal server error",
      });
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }

  public async publishJob(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<any> {
    let connection: PoolClient | undefined = undefined;
    try {
      //TODO - logica deve ser enviada para um lambda que ira validar se o job está apta a ser publicado
      this.eventEmitter.publishJob("publish_job", 1, { jobId: 1 });
      return _res.status(StatusCodes.NOT_IMPLEMENTED).send();
      // .send({ ...rows[0], status: "published" });
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message ?? "internal server error",
      });
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }

  public async editJob(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<any> {
    let connection: PoolClient | undefined = undefined;
    try {
      const jobId = _req.params["job_id"];

      const { title, description, location, notes } = _req.body;

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
        return _res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          message: ReasonPhrases.UNPROCESSABLE_ENTITY,
        });
      }
      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      const [_, { rows }] = await Promise.all([
        this.pgCliente.executeQuery(connection, sqlBase, params),
        this.pgCliente.executeQuery(
          connection,
          `select * from jobs where id = $1 `,
          [jobId]
        ),
      ]);

      await this.pgCliente.commitTransaction(connection);

      return _res.status(StatusCodes.OK).send({ ...rows[0] });
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }

  public async deleteJob(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<any> {
    let connection: PoolClient | undefined = undefined;
    try {
      const jobId = _req.params["job_id"];

      const sql = `
        delete from jobs where id = $1
      `;
      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      await this.pgCliente.executeQuery(connection, sql, [jobId]);

      await this.pgCliente.commitTransaction(connection);

      return _res.status(StatusCodes.ACCEPTED).json({
        message: "resource was successfully excluded",
      });
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message ?? "internal server error",
      });
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }

  public async archiveJob(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<any> {
    let connection: PoolClient | undefined = undefined;
    try {
      const jobId = _req.params["job_id"];

      const sql = `
        update jobs set status = 'archived'::job_status, updated_at = NOW() where id = $1;
      `;
      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      await this.pgCliente.executeQuery(connection, sql, [jobId]);

      await this.pgCliente.commitTransaction(connection);

      return _res.status(StatusCodes.ACCEPTED).json({
        message: "resource was successfully archived",
      });
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message ?? "internal server error",
      });
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }
}
