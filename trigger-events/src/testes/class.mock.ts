import { AWSPortDto } from "src/ports/__dtos__/ports.dtos";
import axios from "axios";
import { PgClienteRepository } from "../infrastructure/database/pg.reposiory";
import { connection } from "./testes.util";
import { PoolClient } from "pg";
import {
  AvailableStatusJobs,
  BaseModuleRepository,
  JobAtributtes,
  JobModuleRepository,
} from "../modules/__dtos__/modules.dtos";
import {
  ModerationResponse,
  ServiceOpenAI,
} from "../infrastructure/services/__dtos__/services.dtos";
import {
  GetObjectRequest,
  ManagedUpload,
  PutObjectRequest,
} from "aws-sdk/clients/s3";
import { JobEntity } from "../entities/job/job.entity";

export class BaseModulMock implements BaseModuleRepository {
  name = "modulename";
  //@ts-ignore
  connection = connection;
}

export class JobModuleMock
  extends BaseModulMock
  implements JobModuleRepository
{
  //@ts-ignore
  connection = connection;
  getJob = jest.fn(async (_jobid: string): Promise<JobEntity> => {
    return new JobEntity({
      id: crypto.randomUUID(),
      company_id: crypto.randomUUID(),
      notes: "notes",
      description: "description",
      title: "title",
      location: "location",
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      status: "draft",
    });
  });

  updateJobStatus = jest.fn(
    async (_jobId: string, _status: AvailableStatusJobs): Promise<void> => {
      return;
    }
  );
  deleteJob = jest.fn(async (_jobId: string): Promise<void> => {
    return;
  });
  updateJoNotes = jest.fn(
    async (_jobId: string, _notes: string): Promise<void> => {
      return;
    }
  );
}

export class PgClienteMock implements PgClienteRepository {
  //@ts-ignore
  client = connection;
  getConnection = jest.fn(async (): Promise<PoolClient> => {
    return "PoolClient" as unknown as PoolClient;
  });
  beginTransaction = jest.fn(async (): Promise<void> => {});
  commitTransaction = jest.fn(async (): Promise<void> => {});
  rolbackTransaction = jest.fn(async (): Promise<void> => {});
  end = jest.fn(async (connection: PoolClient): Promise<void> => {});
}

export class OpenAiServiceMock implements ServiceOpenAI {
  openAPiClient = jest.mocked(axios);
  validateModeration = jest.fn(
    async (_text: string): Promise<ModerationResponse> => {
      return {
        isModerated: true,
        reason: "reason",
      };
    }
  );
}

export class AWSPortMock implements AWSPortDto {
  uploadObjectToS3 = jest.fn(
    async (
      _uploadParams: PutObjectRequest
    ): Promise<ManagedUpload.SendData> => {
      return {
        Location: "Location",
        ETag: "ETag",
        Bucket: "Bucket",
        Key: "Key",
      };
    }
  );
  getObjectFroms3 = jest.fn(
    async (_downloadParams: GetObjectRequest): Promise<any> => {
      return {
        Body: {
          toString: () => {
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
