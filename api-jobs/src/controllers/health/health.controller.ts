import { NextFunction, Request, Response, Router } from "express";
import { GetHealthUseCase } from "../../usecases/health/gethealth.usecase";
import { adaptRoute } from "../adapters";
import { Usecases } from "../shareds";

export class HealthRoutesAdapted {
  public routes: Router = Router();
  constructor(private readonly usecases: Usecases) {
    for (const { method, path, usecase } of this.usecases) {
      this.routes[method](
        path,
        async (req: Request, res: Response, _next: NextFunction) =>
          await adaptRoute(() => usecase.handler({ req }), res)
      );
    }
  }
}

const routesAdapteds = new HealthRoutesAdapted([
  {
    path: "/",
    method: "get",
    usecase: new GetHealthUseCase(),
  },
]);

export const { routes } = routesAdapteds;
