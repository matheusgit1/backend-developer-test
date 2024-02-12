import { StatusCodes } from "http-status-codes";
import { GetHealthUseCase } from "../../usecases/health/gethealth.usecase";
import { Usecases } from "../shareds";
import { HealthRoutesAdapted } from "./health.controller";
import express from "express";
import request from "supertest";

const usecases: Usecases = [
  {
    path: "/",
    method: "get",
    usecase: new GetHealthUseCase(),
  },
];

const app = express();
const routes = new HealthRoutesAdapted(usecases);

app.use("/", routes.routes);

describe(`testes para ${HealthRoutesAdapted.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucessos`, () => {
    it("deve executar '/' com sucesso", async () => {
      const { body, status } = await request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.OK);
    });
  });
});
