import * as pg from "pg";
import { PgClienteRepository } from "../infrastructure/database/pg.repository";
import { HandlerEventClass } from "../infrastructure/services/__dtos__/handler-event.dtos";
import axios, { AxiosInstance } from "axios";
import { CustomEventEmitterClass } from "../infrastructure/events/__dtos__/emiter-events.dtos";
import {
  CompanyModuleRepository,
  CreateJobDto,
  JobModuleRepository,
} from "../modules/__dtos__/modules.dtos";
import {
  BaseModuleRepository,
  FinallyStrategy,
} from "../modules/base.repository";

export const queryresults = {
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
export class PgClienteMock implements PgClienteRepository {
  getConnection = jest.fn(async (): Promise<pg.PoolClient> => {
    return "PoolClient" as unknown as pg.PoolClient;
  });

  beginTransaction = jest.fn(async (): Promise<void> => {});
  commitTransaction = jest.fn(async (): Promise<void> => {});
  rolbackTransaction = jest.fn(async (): Promise<void> => {});
  releaseTransaction = jest.fn(async (): Promise<void> => {});
  executeQuery = jest.fn(
    async (
      _Connection: pg.PoolClient,
      _query: string,
      _params?: any[]
    ): Promise<pg.QueryResult<any>> => {
      return { ...queryresults };
    }
  );
}

export class HandlerEventsMock implements HandlerEventClass {
  client: AxiosInstance = jest.mocked(axios);
  publishEvent = jest.fn(
    async (_topic: string, _version: 1, _payload: any): Promise<void> => {}
  );
}

export class CustomEventEmitterMock implements CustomEventEmitterClass {
  publishJob = jest.fn(
    (topic: string, version: number, payload: any): void => {}
  );
}

export class BaseModuleMock implements BaseModuleRepository {
  connection = jest.mocked("connection" as unknown as any);
  executeQuery = jest.fn(async (): Promise<pg.QueryResult<any>> => {
    return { ...queryresults };
  });
  init = jest.fn(async (): Promise<void> => {});
  beggin = jest.fn(async (): Promise<void> => {});
  end = jest.fn(async (_strategy: FinallyStrategy): Promise<void> => {});
}
export class CompanyModuleMock
  extends BaseModuleMock
  implements CompanyModuleRepository
{
  getCompanies = jest.fn(async (): Promise<Array<any>> => {
    return [
      {
        id: crypto.randomUUID().toString(),
        name: "Company",
      },
    ];
  });
  getCompanyById = jest.fn(async (): Promise<Array<any>> => {
    return [
      {
        id: crypto.randomUUID().toString(),
        name: "Company",
      },
    ];
  });
}

export class JobModuleMock
  extends BaseModuleMock
  implements JobModuleRepository
{
  // id: crypto.randomUUID().toString(),
  createJob = jest.fn(async (_input: CreateJobDto): Promise<void> => {});
  archiveJob = jest.fn(async (_jobId: string): Promise<void> => {});
}
