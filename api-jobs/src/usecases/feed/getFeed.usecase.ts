import { FeedModuleRepository } from "src/modules/__dtos__/modules.dtos";
import { BaseUseCase } from "..";
import { StatusCodes } from "http-status-codes";

export class GetFeedUseCase implements BaseUseCase {
  constructor(private readonly module: FeedModuleRepository) {}
  public async handler({ req }: { req: Request }): Promise<HttpResponse> {
    const feed = await this.module.getFeed();
    return {
      statusCode: StatusCodes.OK,
      body: {
        ...feed,
      },
    };
  }
}
