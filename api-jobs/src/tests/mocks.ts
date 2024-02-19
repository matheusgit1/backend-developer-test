import { Company, FeedJobs } from "../modules/__dtos__/modules.dtos";
import * as pg from "pg";
import { PgClienteRepository } from "../infrastructure/database/pg.repository";
import { HandlerEventService } from "../infrastructure/services/__dtos__/handler-event.dtos";
import axios, { AxiosInstance } from "axios";
import { CustomEventEmitterDto } from "../infrastructure/events/__dtos__/emiter-events.dtos";
import {
  CompanyModuleRepository,
  CreateJobDto,
  FeedModuleRepository,
  JobModuleRepository,
} from "../modules/__dtos__/modules.dtos";
import { BaseModuleRepository } from "../modules/base.repository";
import Cache from "node-cache";
import { AWSPortDto } from "../ports/__dtos__/ports.dtos";
import {
  GetObjectCommandInput,
  GetObjectCommandOutput,
  UploadPartCommandInput,
  UploadPartCommandOutput,
} from "@aws-sdk/client-s3";

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

export class HandlerEventsMock implements HandlerEventService {
  client: AxiosInstance = jest.mocked(axios);
  publishEvent = jest.fn(
    async (_topic: string, _version: 1, _payload: any): Promise<void> => {}
  );
}

export class CustomEventEmitterMock implements CustomEventEmitterDto {
  publishJob = jest.fn(
    (_topic: string, _version: number, _payload: any): void => {}
  );
}

export class BaseModuleMock implements BaseModuleRepository {
  connection = jest.mocked("connection" as unknown as any);
  executeQuery = jest.fn(async (): Promise<pg.QueryResult<any>> => {
    return { ...queryresults };
  });
}
export class CompanyModuleMock
  extends BaseModuleMock
  implements CompanyModuleRepository
{
  getCompanies = jest.fn(async (): Promise<pg.QueryResult<Company>> => {
    return {
      ...queryresults,
      rowCount: 1,
      rows: [
        {
          id: crypto.randomUUID().toString(),
          name: "Company",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
        },
      ],
    };
  });
  getCompanyById = jest.fn(async (): Promise<pg.QueryResult<Company>> => {
    return {
      ...queryresults,
      rowCount: 1,
      rows: [
        {
          id: crypto.randomUUID().toString(),
          name: "Company",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
        },
      ],
    };
  });
}

export class JobModuleMock
  extends BaseModuleMock
  implements JobModuleRepository
{
  // id: crypto.randomUUID().toString(),
  createJob = jest.fn(async (_input: CreateJobDto): Promise<void> => {});
  archiveJob = jest.fn(async (_jobId: string): Promise<void> => {});
  getJobById = jest.fn(async (_jobId: string): Promise<pg.QueryResult<any>> => {
    return { ...queryresults, rowCount: 1 };
  });
  updateJob = jest.fn(
    async (
      _input: Partial<CreateJobDto>,
      _jobId: string
    ): Promise<pg.QueryResult<any>> => {
      return { ...queryresults, rowCount: 1 };
    }
  );
}

export class CacheMock implements Partial<Cache> {
  get = jest.fn((_key: string): any => {});
  set = jest.fn((_key: string, _value: string, _ttl?: number): boolean => {
    return true;
  });
}

export class FeedModuleMock
  extends BaseModuleMock
  implements FeedModuleRepository
{
  getFeed = jest.fn(async (): Promise<FeedJobs> => {
    return {
      feeds: [
        {
          company_id: crypto.randomUUID(),
          id: crypto.randomUUID(),
          status: "published",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          description: "Description",
          title: "Title",
          notes: "Notes",
          location: "Location",
        },
      ],
    };
  });
}

export const S3 = {
  getObject: jest.fn().mockReturnValue({
    promise: () => {
      return {
        Body: {
          toString: () => {
            return JSON.stringify({
              feeds: [
                {
                  id: "id",
                  company_id: "company_id",
                  title: "title",
                  description: "description",
                  notes: "notes",
                  location: "location",
                  created_at: new Date().toString(),
                  updated_at: new Date().toString(),
                  status: "published",
                },
              ],
            } as FeedJobs);
          },
        },
      };
    },
  }),
};

export class AWSPortMock implements AWSPortDto {
  uploadObjectToS3 = jest.fn(
    async (
      _uploadParams: UploadPartCommandInput
    ): Promise<UploadPartCommandOutput> => {
      return {
        $metadata: {},
      };
    }
  );
  getObjectFroms3 = jest.fn(
    async (
      _downloadParams: GetObjectCommandInput
    ): Promise<GetObjectCommandOutput> => {
      return {
        //@ts-ignore
        Body: {
          transformToString: async () => {
            return JSON.stringify({
              feeds: [
                {
                  id: crypto.randomUUID(),
                  company_id: "company",
                  created_at: new Date().toString(),
                  updated_at: new Date().toString(),
                  description: "description",
                  title: "title",
                  notes: "notes",
                  location: "location",
                  status: "published",
                },
              ],
            });
          },
        },
      };
    }
  );
}
