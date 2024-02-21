import { CompanyEntity } from "../../entities/company/company.entity";
import { queryresults } from "../../tests/mocks";
import { CompanyModule } from "./companies.module";

const companyModule = new CompanyModule();

describe(`cenários de testes para ${CompanyModule.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucessos", () => {
    it("deve excutar getCompanies com sucesso", async () => {
      companyModule.connection = {
        //@ts-ignore
        query: async (_quer: string, _params: any[]): Promise<QueryResult> => {
          return { ...queryresults };
        },
      };
      const spy_companyModule_executeQuery = jest.spyOn(
        companyModule,
        "executeQuery"
      );
      const res = await companyModule.getCompanies();
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(Array<CompanyEntity>);
      expect(spy_companyModule_executeQuery).toHaveBeenCalledTimes(1);
    });

    it("deve excutar getCompanyById getCompanies", async () => {
      companyModule.connection = {
        //@ts-ignore
        query: async (_quer: string, _params: any[]): Promise<QueryResult> => {
          return { ...queryresults };
        },
      };
      const spy_companyModule_executeQuery = jest.spyOn(
        companyModule,
        "executeQuery"
      );
      const res = await companyModule.getCompanyById("id");
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(CompanyEntity);
      expect(spy_companyModule_executeQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe("casos de erros", () => {
    it("se conexão não for instanciada, deve retornar erro para qualquer método", async () => {
      companyModule.connection = undefined;
      companyModule.moduleName = "moduleName";
      await expect(companyModule.getCompanies()).rejects.toThrow(
        `conexão com base de dados não foi instaciada. Considere usar moduleName.connection = PoolClient`
      );

      await expect(companyModule.getCompanyById("jobId")).rejects.toThrow(
        `conexão com base de dados não foi instaciada. Considere usar moduleName.connection = PoolClient`
      );
    });
  });
});
