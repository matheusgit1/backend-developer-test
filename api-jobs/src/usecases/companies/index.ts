import { PoolClient } from "pg";
import { NextFunction, Request, Response } from "express";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export class CompaniesUseCase {
  constructor(private readonly pgCliente: PgClienteRepository) {}

  public async getCompanies(
    _req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<any> {
    let connection: PoolClient | undefined = undefined;
    try {
      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      const sql = `
        select * from companies
      `;

      const { rows } = await this.pgCliente.executeQuery(connection, sql);

      return _res.send({
        sucess: 1,
        companies: rows.map((row) => ({
          id: row.id,
          name: row.name,
        })),
      });
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }

  public async getCompanyById(
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<any> {
    let connection: PoolClient | undefined = undefined;
    try {
      const companyId = _req.params["company_id"];
      connection = await this.pgCliente.getConnection();
      await this.pgCliente.beginTransaction(connection);

      const sql = `
        select * from companies where id = $1
      `;

      //TODO - adicionar tratamento para quando o id não existir o recurso
      const { rows } = await this.pgCliente.executeQuery(connection, sql, [
        companyId,
      ]);

      return res.send({
        sucess: 1,
        company: rows[0],
      });
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return res.status(500).json({
        error: err.message ?? "internal server error",
      });
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }
}
