import { FeedJobs } from "../modules/__dtos__/modules.dtos";
import * as pg from "pg";
import { PgClienteRepository } from "../infrastructure/database/pg.repository";
import { HandlerEventService } from "../infrastructure/services/__dtos__/handler-event.dtos";
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
import { CompanyEntity } from "../entities/company/company.entity";
import { Company } from "../entities/__dtos__/entities.dtos";
import { JobEntity } from "../entities/job/job.entity";

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
  getCompanies = jest.fn(async (): Promise<CompanyEntity[]> => {
    const companies: Company[] = [
      {
        id: crypto.randomUUID().toString(),
        name: "Company",
        created_at: new Date().toString(),
        updated_at: new Date().toString(),
      },
    ];
    return companies.map((company) => new CompanyEntity({ ...company }));
  });
  getCompanyById = jest.fn(async (): Promise<CompanyEntity> => {
    const row = {
      id: crypto.randomUUID().toString(),
      name: "Company",
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
    };

    return new CompanyEntity({ ...row });
  });
}

export class JobModuleMock
  extends BaseModuleMock
  implements JobModuleRepository
{
  // id: crypto.randomUUID().toString(),
  createJob = jest.fn(async (_input: CreateJobDto): Promise<void> => {});
  archiveJob = jest.fn(async (_jobId: string): Promise<void> => {});
  getJobById = jest.fn(async (_jobId: string): Promise<JobEntity> => {
    return new JobEntity({
      id: crypto.randomUUID(),
      company_id: crypto.randomUUID(),
      location: "remote",
      description: "description",
      title: "title",
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      notes: "notes",
      status: "draft",
    });
  });
  updateJob = jest.fn(
    async (_input: Partial<CreateJobDto>, _jobId: string): Promise<void> => {}
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

export class HandlerEventMock implements HandlerEventService {
  publishEvent = jest.fn(
    async (topic: string, version: 1, payload: any): Promise<void> => {}
  );
}
