import { NextFunction, Request, Response, Router } from "express";
import { adaptRoute } from "../adapters";
import { CreateJobUseCase } from "../../usecases/jobs/CreateJob.usecase";
import { PgCliente } from "../../infrastructure/database/client/database.repository";
import { PublishJobUseCase } from "../../usecases/jobs/publishJob.usecase";
import { CustomEventEmitter } from "../../infrastructure/events/emiter.events";
import { EventEmitter } from "node:events";
import { HandlerEvents } from "../../infrastructure/services/handle-eventos.service";
import { EditJobUseCase } from "../../usecases/jobs/editJob.usecase";
import { DeleteJobUseCase } from "../../usecases/jobs/deleteJob.usecase";
import { ArchiveJobUseCase } from "../../usecases/jobs/archiveJob.usecase";
import { Usecases } from "../shareds";
import { JobsModule } from "../../modules/jobs/jobs.modules";

const pgCliente = new PgCliente();
const jobModule = new JobsModule(pgCliente);

export class JobsRoutesAdapted {
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

const routesAdapteds = new JobsRoutesAdapted([
  {
    path: "/",
    method: "post",
    usecase: new CreateJobUseCase(jobModule),
  },
  {
    path: "/:job_id/publish",
    method: "put",
    usecase: new PublishJobUseCase(
      jobModule,
      new CustomEventEmitter(new EventEmitter(), new HandlerEvents())
    ),
  },
  {
    path: "/:job_id",
    method: "put",
    usecase: new EditJobUseCase(jobModule),
  },
  {
    path: "/:job_id",
    method: "delete",
    usecase: new DeleteJobUseCase(jobModule),
  },
  {
    path: "/:job_id/archive",
    method: "put",
    usecase: new ArchiveJobUseCase(jobModule),
  },
]);

export const { routes } = routesAdapteds;
