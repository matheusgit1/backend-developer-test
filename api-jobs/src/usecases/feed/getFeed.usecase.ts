import {
  FeedJobs,
  FeedModuleRepository,
} from "../../modules/__dtos__/modules.dtos";
import { BaseUseCase } from "..";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Cache from "node-cache";

const cacheKey = "feed-json";

export class GetFeedUseCase implements BaseUseCase {
  constructor(
    private readonly module: FeedModuleRepository,
    private readonly cache: Cache
  ) {}
  public async handler({ req: _req }: { req: Request }): Promise<HttpResponse> {
    try {
      /**
       * @description NOTA. Apesar de parecer mais interesseante num primeito momento o uso direto do json, a medida
       * que o volume de dados cresce, é importante o uso de processamento de dados sob demando.
       * qunatos menos pesado for o json no s3, mas rapido o endpoint retornara para  o cliente a lista que ele quer, mas...
       * em um cenário de muitas requisições com um json muito pesado, fica inviavel essa implementação.
       * Aqui em baixo tem um exemplo de implementação de entrega de conteudo do json sob demanda, simulando web socket
       * use as nodejs stream para tratar e processar e entregar sob demanda os dados.
       */
      // str
      //   .pipeThrough(
      //     new TransformStream({
      //       transform(chunk, controller) {
      //         const d = JSON.parse(
      //           JSON.stringify(
      //             String.fromCharCode.apply(
      //               null,
      //               new Uint8Array(Buffer.from(chunk).toJSON().data)
      //             )
      //           )
      //         );
      //         console.log(d);
      //         controller.enqueue(d);
      //       },
      //     })
      //   )
      //   .pipeTo(
      //     new WritableStream({
      //       async write(chunk) {
      //         res.write(chunk);
      //       },
      //       close() {
      //         res.end();
      //       },
      //     })
      //   );
      const feedInCache = this.cache.get<string>(cacheKey);

      if (feedInCache) {
        return {
          statusCode: StatusCodes.OK,
          body: {
            data: JSON.parse(feedInCache),
          },
        };
      }
      //cria cache a cada 30 min - 60 * 30
      const feed = await this.module.getFeed();

      this.cache.set(
        cacheKey,
        JSON.stringify(feed),
        60 * 30 // 60 segundos * 30 = 30 Minutos
      );
      return {
        statusCode: StatusCodes.OK,
        body: {
          data: {
            ...feed,
          },
        },
      };
    } catch (err) {
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    }
  }
}
