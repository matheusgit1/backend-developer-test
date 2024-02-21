import { connection } from "../../testes/testes.util";
import { JobModule } from "./jobs.modules";
import { FakeLogger } from "../../infrastructure/logger/fake-logger";
// import { queryresults } from "../../tests/mocks";
const fakeLogger = new FakeLogger(JobModule.name);
const jobModule = new JobModule();

describe(`cenários de testes para ${JobModule.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucessos", () => {
    it("deve executar deleteJob corretamente", async () => {
      //@ts-ignore
      jobModule.connection = connection;

      const spy_jobModule_executeQuery = jest.spyOn(jobModule, "executeQuery");

      const res = await jobModule.deleteJob("jobId");

      expect(res).toBeUndefined();
      expect(spy_jobModule_executeQuery).toHaveBeenCalledTimes(1);
    });

    it("deve executar getJob corretamente", async () => {
      //@ts-ignore
      jobModule.connection = connection;

      const spy_jobModule_executeQuery = jest.spyOn(jobModule, "executeQuery");

      const res = await jobModule.getJob("jobId");

      expect(res).toBeDefined();
      expect(spy_jobModule_executeQuery).toHaveBeenCalledTimes(1);
    });

    it("deve executar updateJobStatus corretamente", async () => {
      //@ts-ignore
      jobModule.connection = connection;

      const spy_jobModule_executeQuery = jest.spyOn(jobModule, "executeQuery");

      const res = await jobModule.updateJobStatus("jobId", "published");

      expect(res).toBeUndefined();
      expect(spy_jobModule_executeQuery).toHaveBeenCalledTimes(1);
    });

    it("deve executar updateJoNotes corretamente", async () => {
      //@ts-ignore
      jobModule.connection = connection;

      const spy_jobModule_executeQuery = jest.spyOn(jobModule, "executeQuery");

      const res = await jobModule.updateJoNotes("jobId", "published");

      expect(res).toBeUndefined();
      expect(spy_jobModule_executeQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe("casos de erros", () => {
    it("se conexão não for instanciada, deve retornar erro para qualquer método", async () => {
      jobModule.connection = undefined;
      jobModule.name = "moduleName";
      await expect(
        jobModule.updateJobStatus("jobID", "archived")
      ).rejects.toThrow(
        `conexão com base de dados não foi instanciada. Considere usar moduleName.connection = PoolClient`
      );

      await expect(jobModule.getJob("jobId")).rejects.toThrow(
        `conexão com base de dados não foi instanciada. Considere usar moduleName.connection = PoolClient`
      );

      await expect(jobModule.deleteJob("jobid")).rejects.toThrow(
        `conexão com base de dados não foi instanciada. Considere usar moduleName.connection = PoolClient`
      );

      await expect(jobModule.updateJoNotes("jobid", "notes")).rejects.toThrow(
        `conexão com base de dados não foi instanciada. Considere usar moduleName.connection = PoolClient`
      );
    });
  });
});
