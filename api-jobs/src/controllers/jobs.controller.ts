import { Router } from "express";
import { PgCliente } from "../infrastructure/database/client/database.repository";
import { JobsUseCase } from "../usecases/jobs";
import { HandlerEvents } from "../infrastructure/services/handle-eventos.service";
import { CustomEventEmitter } from "../infrastructure/events/emiter.events";
import { EventEmitter } from "stream";

const routes = Router();

const usecase = new JobsUseCase(
  new PgCliente(),
  new CustomEventEmitter(new EventEmitter(), new HandlerEvents())
);

routes.post(
  "/",
  async (_req, _res, _next) => await usecase.createJob(_req, _res, _next)
);

routes.put(
  "/:job_id/publish",
  async (_req, _res, _next) => await usecase.publishJob(_req, _res, _next)
);

routes.put(
  "/:job_id",
  async (_req, _res, _next) => await usecase.editJob(_req, _res, _next)
);

routes.delete(
  "/:job_id",
  async (_req, _res, _next) => await usecase.deleteJob(_req, _res, _next)
);

routes.put(
  "/:job_id/archive",
  async (_req, _res, _next) => await usecase.archiveJob(_req, _res, _next)
);

export { routes };
