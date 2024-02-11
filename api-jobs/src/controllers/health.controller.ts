import { Router } from "express";
import { HealthUseCase } from "../usecases/health";

const routes = Router();

const healthusecase = new HealthUseCase();

routes.get("/", (req, res) => healthusecase.getHealth(req, res));

export { routes };
