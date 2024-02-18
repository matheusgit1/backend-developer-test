import { QueryResult } from "pg";
import { JobsModule } from "./jobs.modules";
import { queryresults } from "../../tests/mocks";

const jobModule = new JobsModule();

describe(`cenários de testes para ${JobsModule.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucessos", () => {
    it("deve executar createJob corretamente", async () => {
      jobModule.connection = {
        //@ts-ignore
        query: async (_quer: string, _params: any[]): Promise<QueryResult> => {
          return { ...queryresults };
        },
      };

      const spy_jobModule_executeQuery = jest.spyOn(jobModule, "executeQuery");

      const res = await jobModule.createJob({
        title: "title",
        description: "description",
        location: "location",
        companyId: "companyId",
        notes: "notes",
      });

      expect(res).toBeUndefined();
      expect(spy_jobModule_executeQuery).toHaveBeenCalledTimes(1);
    });

    it("deve executar archiveJob corretamente", async () => {
      jobModule.connection = {
        //@ts-ignore
        query: async (_quer: string, _params: any[]): Promise<QueryResult> => {
          return { ...queryresults };
        },
      };

      const spy_jobModule_executeQuery = jest.spyOn(jobModule, "executeQuery");

      const res = await jobModule.archiveJob("jobId");

      expect(res).toBeUndefined();
      expect(spy_jobModule_executeQuery).toHaveBeenCalledTimes(1);
    });

    it("deve executar deleteJob corretamente", async () => {
      jobModule.connection = {
        //@ts-ignore
        query: async (_quer: string, _params: any[]): Promise<QueryResult> => {
          return { ...queryresults };
        },
      };

      const spy_jobModule_executeQuery = jest.spyOn(jobModule, "executeQuery");

      const res = await jobModule.deleteJob("jobId");

      expect(res).toBeDefined();
      expect(spy_jobModule_executeQuery).toHaveBeenCalledTimes(1);
    });

    it("deve executar updateJob corretamente", async () => {
      jobModule.connection = {
        //@ts-ignore
        query: async (_quer: string, _params: any[]): Promise<QueryResult> => {
          return { ...queryresults };
        },
      };

      const spy_jobModule_executeQuery = jest.spyOn(jobModule, "executeQuery");

      const res = await jobModule.updateJob(
        {
          title: "title",
          description: "description",
          location: "location",
          companyId: "companyId",
          notes: "notes",
        },
        "jobid"
      );

      expect(res).toBeDefined();
      expect(spy_jobModule_executeQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe("casos de erros", () => {
    it("se conexão não for instanciada, deve retornar erro para qualquer método", async () => {
      jobModule.connection = undefined;
      jobModule.moduleName = "moduleName";
      await expect(
        jobModule.createJob({
          title: "title",
          description: "description",
          location: "location",
          companyId: "companyId",
          notes: "notes",
        })
      ).rejects.toThrow(
        `conexão com base de dados não foi instaciada. Considere usar moduleName.connection = PoolClient`
      );

      await expect(jobModule.archiveJob("jobId")).rejects.toThrow(
        `conexão com base de dados não foi instaciada. Considere usar moduleName.connection = PoolClient`
      );

      await expect(jobModule.deleteJob("jobId")).rejects.toThrow(
        `conexão com base de dados não foi instaciada. Considere usar moduleName.connection = PoolClient`
      );

      await expect(
        jobModule.updateJob(
          {
            title: "title",
            description: "description",
            location: "location",
            companyId: "companyId",
            notes: "notes",
          },
          "jobid"
        )
      ).rejects.toThrow(
        `conexão com base de dados não foi instaciada. Considere usar moduleName.connection = PoolClient`
      );
    });
  });
});
