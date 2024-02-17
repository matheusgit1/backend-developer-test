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
      const feedInCache = this.cache.get<string>(cacheKey);
      if (feedInCache) {
        return {
          statusCode: StatusCodes.OK,
          body: {
            ...JSON.parse(feedInCache),
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
          ...feed,
        },
      };
    } catch (err) {
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      };
    }
  }
}
