import { JobModuleMock, queryresults } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { Usecases } from "../shareds";
import express from "express";
import request from "supertest";

import { CustomEventEmitterMock, PgClienteMock } from "../../tests/mocks";
import { JobsRoutesAdapted } from "./jobs.controller";
import { CreateJobUseCase } from "../../usecases/jobs/CreateJob.usecase";
import { PublishJobUseCase } from "../../usecases/jobs/publishJob.usecase";
import { EditJobUseCase } from "../../usecases/jobs/editJob.usecase";
import { DeleteJobUseCase } from "../../usecases/jobs/deleteJob.usecase";
import { ArchiveJobUseCase } from "../../usecases/jobs/archiveJob.usecase";

const pgClienteMock = new PgClienteMock();
const jobModuleMock = new JobModuleMock();
const mockCustomEventEmitter = new CustomEventEmitterMock();

const usecases: Usecases = [
  {
    path: "/",
    method: "post",
    usecase: new CreateJobUseCase(jobModuleMock),
  },
  {
    path: "/:job_id/publish",
    method: "put",
    usecase: new PublishJobUseCase(pgClienteMock, mockCustomEventEmitter),
  },
  {
    path: "/:job_id",
    method: "put",
    usecase: new EditJobUseCase(pgClienteMock),
  },
  {
    path: "/:job_id",
    method: "delete",
    usecase: new DeleteJobUseCase(pgClienteMock),
  },
  {
    path: "/:job_id/archive",
    method: "put",
    usecase: new ArchiveJobUseCase(jobModuleMock),
  },
];

const { routes } = new JobsRoutesAdapted(usecases);

const app = express();
app.use(express.json());

app.use("/", routes);

const jobId = crypto.randomUUID().toString();

describe(`testes para ${JobsRoutesAdapted.name}`, () => {
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
        .post("/")
        .send({
          title: "title",
          description: "description",
          location: "location",
          notes: "notes",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set("company_id", crypto.randomUUID().toString());

      expect(status).toBe(StatusCodes.CREATED);
    });

    it("deve executar '/:job_id/publish' com sucesso", async () => {
      const { body, status } = await request(app).put(`/${jobId}/publish`);
      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.NOT_IMPLEMENTED);
    });

    it("deve executar '/:job_id' com sucesso", async () => {
      const { body, status } = await request(app)
        .put(`/${jobId}`)
        .send({
          title: "title",
          description: "description",
          location: "location",
          notes: "notes",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(status).toBe(StatusCodes.OK);
    });

    it("deve executar '/:job_id' com sucesso mesmo com apenas um parametro", async () => {
      const { body, status } = await request(app)
        .put(`/${jobId}`)
        .send({
          title: "title",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(status).toBe(StatusCodes.OK);
    });

    it("deve executar '/:job_id' (delete) com sucesso", async () => {
      const { body, status } = await request(app)
        .delete(`/${jobId}`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(status).toBe(StatusCodes.ACCEPTED);
    });

    it("deve executar '/:job_id/archive' com sucesso", async () => {
      const { body, status } = await request(app)
        .put(`/${jobId}/archive`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(status).toBe(StatusCodes.ACCEPTED);
    });
  });

  describe(`casos de erros`, () => {
    describe('cenários para "/"', () => {
      it(`deve executar '/' com status code ${StatusCodes.INTERNAL_SERVER_ERROR} se alguma ação na base de dados falhar (conexão)`, async () => {
        jobModuleMock.init.mockRejectedValueOnce(new Error("erro mockado"));
        const { body, status } = await request(app)
          .post("/")
          .send({
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("company_id", crypto.randomUUID().toString());
        expect(body).toBeDefined();
        expect(status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      });
      it(`deve executar '/' com status code ${StatusCodes.BAD_REQUEST} se parametros não forem informdos corretamente`, async () => {
        const { body, status } = await request(app)
          .post("/")
          .send({
            title: "title",
            description: "description",
            location: "location",
            // notes: "notes",
          })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.BAD_REQUEST);
      });
      it(`deve executar '/' com ${StatusCodes.BAD_REQUEST} se company_id não for informado`, async () => {
        const { body, status } = await request(app)
          .post("/")
          .send({
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
        // .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.BAD_REQUEST);
      });
    });
    describe('cenários para "/:job_id/publish"', () => {
      it(`deve executar '/' com status code ${StatusCodes.NOT_IMPLEMENTED}`, async () => {
        const { body, status } = await request(app)
          .put(`/${jobId}/publish`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
        // .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.NOT_IMPLEMENTED);
      });
    });
    describe('cenários para "/:job_id" (edição)', () => {
      it(`deve executar '/' com status code ${StatusCodes.INTERNAL_SERVER_ERROR} se alguma ação na base de dados falhar (commit)`, async () => {
        pgClienteMock.commitTransaction.mockRejectedValueOnce(new Error());
        const { body, status } = await request(app)
          .put(`/${jobId}`)
          .send({
            title: "title",
            description: "description",
            location: "location",
            notes: "notes",
          })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
        // .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      });
      it(`deve executar '/' com status code ${StatusCodes.UNPROCESSABLE_ENTITY} se ao menso um parametro não for informado`, async () => {
        const { body, status } = await request(app)
          .put(`/${jobId}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
        // .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      });
      it(`deve executar '/' com status code ${StatusCodes.UNPROCESSABLE_ENTITY} se o jobId não for localizado na base`, async () => {
        pgClienteMock.executeQuery.mockResolvedValueOnce({
          ...queryresults,
          rowCount: 0,
        });
        const { body, status } = await request(app)
          .put(`/${jobId}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
        // .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      });
    });
    describe('cenários para "/:job_id" (delete)', () => {
      it(`deve executar '/' com status code ${StatusCodes.INTERNAL_SERVER_ERROR} se alguma ação na base de dados falhar (conexão)`, async () => {
        pgClienteMock.getConnection.mockRejectedValueOnce(new Error());
        const { body, status } = await request(app)
          .delete(`/${jobId}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
        // .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      });
      it(`deve executar '/:job_id' (delete) com status code ${StatusCodes.UNPROCESSABLE_ENTITY} se o jobId não for localizado na base`, async () => {
        pgClienteMock.executeQuery.mockResolvedValue({
          ...queryresults,
          rowCount: 0,
        });
        const { body, status } = await request(app)
          .delete(`/${jobId}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      });
    });
    describe('cenários para "/:job_id/archive" ', () => {
      it(`deve executar '/:job_id/archive' com status code ${StatusCodes.INTERNAL_SERVER_ERROR} se alguma ação na base de dados falhar (conexão)`, async () => {
        pgClienteMock.getConnection.mockRejectedValueOnce(new Error());
        const { body, status } = await request(app)
          .delete(`/${jobId}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
        // .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      });
      it(`deve executar '/:job_id/archive' com status code ${StatusCodes.INTERNAL_SERVER_ERROR} se alguma ação na base de dados falhar (conexão)`, async () => {
        pgClienteMock.getConnection.mockRejectedValueOnce(new Error());
        const { body, status } = await request(app)
          .delete(`/${jobId}`)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");
        // .set("company_id", crypto.randomUUID().toString());
        expect(status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
