import {
  CreateJobDto,
  FeedJobs,
  FeedModuleRepository,
  JobModuleRepository,
} from "../../modules/__dtos__/modules.dtos";
import { GetCompaniesUseCase } from "../../usecases/companies/getCompanies.usecase";
import { HealthRoutesAdapted } from "../../controllers/health/health.controller";
import { Usecases } from "../../controllers/shareds";
import { GetHealthUseCase } from "../../usecases/health/gethealth.usecase";
import { GetCompanyByIdUseCase } from "../../usecases/companies/getCompanyById.usecase";
import { CompaniesRoutesAdapted } from "../../controllers/companies/companies.controller";
import { CreateJobUseCase } from "../../usecases/jobs/createJob.usecase";
import { PublishJobUseCase } from "../../usecases/jobs/publishJob.usecase";
import { EditJobUseCase } from "../../usecases/jobs/editJob.usecase";
import { DeleteJobUseCase } from "../../usecases/jobs/deleteJob.usecase";
import { ArchiveJobUseCase } from "../../usecases/jobs/archiveJob.usecase";
import { JobsRoutesAdapted } from "../../controllers/jobs/jobs.controller";
import { CustomEventEmitterDto } from "../../infrastructure/events/__dtos__/emiter-events.dtos";
import { PgClienteRepository } from "../../infrastructure/database/pg.repository";
import { PoolClient, QueryResult } from "pg";
import { CompanyModuleRepository } from "../../modules/__dtos__/modules.dtos";
import { FeedRoutesAdapted } from "../../controllers/feed/feed.controller";
import { GetFeedUseCase } from "../../usecases/feed/getFeed.usecase";
import Cache from "node-cache";

export const queryresults: QueryResult<any> = {
  rowCount: 1,
  rows: [],
  oid: null,
  command: "command",
  fields: [
    {
      name: "name",
      tableID: 1,
      columnID: 1,
      dataTypeID: 1,
      dataTypeSize: 1,
      dataTypeModifier: 1,
      format: "format",
    },
  ],
};

const latencia = 500; //milisegundos

const cache: Partial<Cache> = {
  get: (_key: string): any => {},
  /**@ts-ignore */
  set: (_key: Cache.Key, _value: string, _ttl: number): boolean => {
    return true;
  },
};

const connection: PoolClient = {
  //@ts-ignore
  query: async (_query: string, _params?: any[]): Promise<QueryResult<any>> => {
    return { ...queryresults, rowCount: 1 };
  },
};

const jobModuleMock: JobModuleRepository = {
  connection: connection,
  executeQuery: async (
    _query: string,
    _params?: any[]
  ): Promise<QueryResult<any>> => {
    return { ...queryresults, rowCount: 1 };
  },
  createJob: async (_input: CreateJobDto): Promise<void> => {},
  archiveJob: async (_jobId: string): Promise<void> => {},
  getJobById: async (_jobId: string): Promise<QueryResult<any>> => {
    return { ...queryresults, rowCount: 1 };
  },
  updateJob: async (
    _input: Partial<CreateJobDto>,
    _jobId: string
  ): Promise<QueryResult<any>> => {
    return { ...queryresults, rowCount: 1 };
  },
};

const companyModuleMock: CompanyModuleRepository = {
  connection: connection,
  executeQuery: async (
    _query: string,
    _params?: any[]
  ): Promise<QueryResult<any>> => {
    return { ...queryresults, rowCount: 1 };
  },
  getCompanies: async (): Promise<QueryResult<any>> => {
    return {
      ...queryresults,
      rowCount: 1,
      rows: [
        {
          id: crypto.randomUUID().toString(),
          name: "Company",
          status: "draft",
        },
      ],
    };
  },
  getCompanyById: async (): Promise<QueryResult<any>> => {
    return {
      ...queryresults,
      rowCount: 1,
      rows: [
        {
          id: crypto.randomUUID().toString(),
          name: "Company",
          status: "draft",
        },
      ],
    };
  },
};

const feedmoduleMock: FeedModuleRepository = {
  connection: "connection" as unknown as any,
  executeQuery: async (): Promise<QueryResult<any>> => {
    return { ...queryresults };
  },
  getFeed: async (): Promise<FeedJobs> => {
    return {
      feeds: [],
    };
  },
};

const pgClienteMock: PgClienteRepository = {
  getConnection: async (): Promise<PoolClient> => {
    return "PoolClient" as unknown as PoolClient;
  },

  beginTransaction: async (): Promise<void> => {},
  commitTransaction: async (): Promise<void> => {},
  rolbackTransaction: async (): Promise<void> => {},
  releaseTransaction: async (): Promise<void> => {},
};

const mockCustomEventEmitter: CustomEventEmitterDto = {
  publishJob(_topic: string, _version: number, _payload: any) {},
};

const companiesusecases: Usecases = [
  {
    path: "/",
    method: "get",
    usecase: new GetCompaniesUseCase(pgClienteMock, companyModuleMock),
  },
  {
    path: "/:company_id",
    method: "get",
    usecase: new GetCompanyByIdUseCase(pgClienteMock, companyModuleMock),
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
    usecase: new CreateJobUseCase(pgClienteMock, jobModuleMock),
  },
  {
    path: "/:job_id/publish",
    method: "put",
    usecase: new PublishJobUseCase(
      pgClienteMock,
      jobModuleMock,
      mockCustomEventEmitter
    ),
  },
  {
    path: "/:job_id",
    method: "put",
    usecase: new EditJobUseCase(
      pgClienteMock,
      jobModuleMock,
      mockCustomEventEmitter
    ),
  },
  {
    path: "/:job_id",
    method: "delete",
    usecase: new DeleteJobUseCase(
      pgClienteMock,
      jobModuleMock,
      mockCustomEventEmitter
    ),
  },
  {
    path: "/:job_id/archive",
    method: "put",
    usecase: new ArchiveJobUseCase(pgClienteMock, jobModuleMock),
  },
];

const feedusecases: Usecases = [
  {
    path: "/",
    method: "get",
    usecase: new GetFeedUseCase(feedmoduleMock, cache as any),
  },
];

export const { routes: jobroutes } = new JobsRoutesAdapted(jobsusecases);
export const { routes: healthroutes } = new HealthRoutesAdapted(helthUsecases);
export const { routes: companyroutes } = new CompaniesRoutesAdapted(
  companiesusecases
);
export const { routes: feedRoutes } = new FeedRoutesAdapted(feedusecases);
