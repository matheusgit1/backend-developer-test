import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { BaseUseCase } from "..";
import { PoolClient } from "pg";
import { Request } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomEventEmitterClass } from "../../infrastructure/events/__dtos__/emiter-events.dtos";

export class PublishJobUseCase implements BaseUseCase {
  constructor(
    private readonly pgCliente: PgClienteRepository,
    private readonly eventEmitter: CustomEventEmitterClass
  ) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    let connection: PoolClient | undefined = undefined;
    try {
      //TODO - logica deve ser enviada para um lambda que ira validar se o job está apta a ser publicado
      this.eventEmitter.publishJob("publish_job", 1, { jobId: 1 });
      return {
        statusCode: StatusCodes.NOT_IMPLEMENTED,
        body: {
          message: ReasonPhrases.NOT_IMPLEMENTED,
        },
      };
    } catch (err) {
      if (connection) await this.pgCliente.rolbackTransaction(connection);

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    } finally {
      if (connection) await this.pgCliente.releaseTransaction(connection);
    }
  }
}
