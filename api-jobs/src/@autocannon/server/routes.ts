import { CreateJobDto } from "./../../modules/__dtos__/modules.dtos";
import { JobModuleRepository } from "src/modules/__dtos__/modules.dtos";
import { GetCompaniesUseCase } from "../../usecases/companies/getCompanies.usecase";
import { HealthRoutesAdapted } from "../../controllers/health/health.controller";
import { Usecases } from "../../controllers/shareds";
import { GetHealthUseCase } from "../../usecases/health/gethealth.usecase";
import { queryresults } from "../../tests/mocks";
import { GetCompanyByIdUseCase } from "../../usecases/companies/getCompanyById.usecase";
import { CompaniesRoutesAdapted } from "../../controllers/companies/companies.controller";
import { CreateJobUseCase } from "../../usecases/jobs/CreateJob.usecase";
import { PublishJobUseCase } from "../../usecases/jobs/publishJob.usecase";
import { EditJobUseCase } from "../../usecases/jobs/editJob.usecase";
import { DeleteJobUseCase } from "../../usecases/jobs/deleteJob.usecase";
import { ArchiveJobUseCase } from "../../usecases/jobs/archiveJob.usecase";
import { JobsRoutesAdapted } from "../../controllers/jobs/jobs.controller";
import { CustomEventEmitterClass } from "../../infrastructure/events/__dtos__/emiter-events.dtos";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { PoolClient, QueryResult } from "pg";
import { FinallyStrategy } from "../../modules/base.repository";
import { CompanyModuleRepository } from "../../modules/__dtos__/modules.dtos";

const latencia = 2000;

const jobModuleMock: JobModuleRepository = {
  connection: "connection" as unknown as any,
  executeQuery: async (): Promise<QueryResult<any>> => {
    return { ...queryresults };
  },
  init: async (): Promise<void> => {},
  beggin: async (): Promise<void> => {},
  end: async (_strategy: FinallyStrategy): Promise<void> => {},
  createJob: async (_input: CreateJobDto): Promise<void> => {},
  archiveJob: async (_jobId: string): Promise<void> => {},
};

const companyModuleMock: CompanyModuleRepository = {
  connection: "connection" as unknown as any,
  executeQuery: async (): Promise<QueryResult<any>> => {
    return { ...queryresults };
  },
  init: async (): Promise<void> => {},
  beggin: async (): Promise<void> => {},
  end: async (_strategy: FinallyStrategy): Promise<void> => {},
  getCompanies: async (): Promise<Array<any>> => {
    return [
      {
        id: crypto.randomUUID().toString(),
        name: "Company",
      },
    ];
  },
  getCompanyById: async (): Promise<Array<any>> => {
    return [
      {
        id: crypto.randomUUID().toString(),
        name: "Company",
      },
    ];
  },
};

const pgClienteMock: PgClienteRepository = {
  getConnection: async (): Promise<PoolClient> => {
    return "PoolClient" as unknown as PoolClient;
  },

  beginTransaction: async (): Promise<void> => {
    return new Promise<void>((_resolve, _reject) => {
      setTimeout(() => {}, latencia);
    });
  },
  commitTransaction: async (): Promise<void> => {
    return new Promise<void>((_resolve, _reject) => {
      setTimeout(() => {}, latencia);
    });
  },
  rolbackTransaction: async (): Promise<void> => {
    return new Promise<void>((_resolve, _reject) => {
      setTimeout(() => {}, latencia);
    });
  },
  releaseTransaction: async (): Promise<void> => {
    return new Promise<void>((_resolve, _reject) => {
      setTimeout(() => {}, latencia);
    });
  },
  executeQuery: async (
    _Connection: PoolClient,
    _query: string,
    _params?: any[]
  ): Promise<QueryResult<any>> => {
    new Promise<void>((_resolve, _reject) => {
      setTimeout(() => {}, latencia);
    });
    return { ...queryresults };
  },
};

const mockCustomEventEmitter: CustomEventEmitterClass = {
  publishJob(_topic: string, _version: number, _payload: any) {
    new Promise<void>((_resolve, _reject) => {
      setTimeout(() => {}, latencia);
    });
  },
};

const companiesusecases: Usecases = [
  {
    path: "/",
    method: "get",
    usecase: new GetCompaniesUseCase(companyModuleMock),
  },
  {
    path: "/:company_id",
    method: "get",
    usecase: new GetCompanyByIdUseCase(companyModuleMock),
  },
];

const helthUsecases: Usecases = [
  {
    path: "/",
    method: "get",
    usecase: new GetHealthUseCase(),
  },
];

const jobsusecases: Usecases = [
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

export const { routes: jobroutes } = new JobsRoutesAdapted(jobsusecases);
export const { routes: helthroutes } = new HealthRoutesAdapted(helthUsecases);
export const { routes: companyroutes } = new CompaniesRoutesAdapted(
  companiesusecases
);
