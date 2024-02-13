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
import { CustomEventEmitterClass } from "../../infrastructure/events/dtos/emiter-events.dtos";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { PoolClient, QueryResult } from "pg";
// import { PgCliente } from "../../infrastructure/database/client/database.repository";

const pgClienteMock: PgClienteRepository = {
  getConnection: async (): Promise<PoolClient> => {
    return "PoolClient" as unknown as PoolClient;
  },

  beginTransaction: async (): Promise<void> => {},
  commitTransaction: async (): Promise<void> => {},
  rolbackTransaction: async (): Promise<void> => {},
  releaseTransaction: async (): Promise<void> => {},
  executeQuery: async (
    _Connection: PoolClient,
    _query: string,
    _params?: any[]
  ): Promise<QueryResult<any>> => {
    return { ...queryresults };
  },
};

const mockCustomEventEmitter: CustomEventEmitterClass = {
  publishJob(_topic: string, _version: number, _payload: any) {},
};

// const pgCliente = new PgCliente();

const companiesusecases: Usecases = [
  {
    path: "/",
    method: "get",
    usecase: new GetCompaniesUseCase(pgClienteMock),
  },
  {
    path: "/:company_id",
    method: "get",
    usecase: new GetCompanyByIdUseCase(pgClienteMock),
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
    usecase: new CreateJobUseCase(pgClienteMock),
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
    usecase: new ArchiveJobUseCase(pgClienteMock),
  },
];

export const { routes: jobroutes } = new JobsRoutesAdapted(jobsusecases);
export const { routes: helthroutes } = new HealthRoutesAdapted(helthUsecases);
export const { routes: companyroutes } = new CompaniesRoutesAdapted(
  companiesusecases
);
