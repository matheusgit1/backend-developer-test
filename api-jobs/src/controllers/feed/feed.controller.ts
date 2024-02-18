import { NextFunction, Request, Response, Router } from "express";
import { adaptRoute } from "../adapters";
import { Usecases } from "../shareds";
import { GetFeedUseCase } from "../../usecases/feed/getFeed.usecase";
import { FeedModule } from "../../modules/feed/feed.module";
import Cache from "node-cache";

const cache = new Cache();
const feedModule = new FeedModule();

export class FeedRoutesAdapted {
  public routes: Router = Router();
  constructor(private readonly usecases: Usecases) {
    for (const { method, path, usecase } of this.usecases) {
      this.routes[method.toLowerCase()](
        path,
        async (req: Request, res: Response, _next: NextFunction) =>
          await adaptRoute(() => usecase.handler({ req }), res)
      );
    }
  }
}

const routesAdapteds = new FeedRoutesAdapted([
  {
    path: "/",
    method: "get",
    usecase: new GetFeedUseCase(feedModule, cache),
  },
]);

export const { routes } = routesAdapteds;
