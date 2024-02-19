import { AWSPortDto } from "src/ports/__dtos__/ports.dtos";
import axios from "axios";
import { PgClienteRepository } from "../infrastructure/database/pg.reposiory";
import {
  EventHandlerBase,
  EventHandlerBaseDto,
} from "../events/base.event-handler";
import {
  DeleteJobDto,
  EditJobDto,
  EventHandlerDictionary,
  PublishJobDto,
} from "../functions/sqs/__dtos__/handlers.dto";
import { connection, queryresults } from "./testes.util";
import { PoolClient, QueryResult } from "pg";
import {
  AvailableStatusJobs,
  BaseModuleRepository,
  JobAtributtes,
  JobModuleRepository,
} from "../modules/__dtos__/modules.dtos";
import { ServiceOpenAI } from "src/infrastructure/services/__dtos__/services.dtos";
import {
  GetObjectRequest,
  ManagedUpload,
  PutObjectRequest,
} from "aws-sdk/clients/s3";

export class BaseModulMock implements BaseModuleRepository {
  name = "modulename";
  //@ts-ignore
  connection = connection;
  executeQuery = jest.fn(
    async (_query: string, _params?: any[]): Promise<QueryResult<any>> => {
      return { ...queryresults };
    }
  );
}

export class MockPublishJobEventHandler
  implements EventHandlerBase<PublishJobDto>
{
  handler = jest.fn(
    async (_event: EventHandlerBaseDto<PublishJobDto>): Promise<void> => {}
  );
}

export class MockEditJobEventHandler implements EventHandlerBase<EditJobDto> {
  handler = jest.fn(
    async (_event: EventHandlerBaseDto<PublishJobDto>): Promise<void> => {}
  );
}

export class MockDeleteJobEventHandler
  implements EventHandlerBase<DeleteJobDto>
{
  handler = jest.fn(
    async (_event: EventHandlerBaseDto<PublishJobDto>): Promise<void> => {}
  );
}

export class JobModuleMock
  extends BaseModulMock
  implements JobModuleRepository
{
  //@ts-ignore
  connection = connection;
  getJob = jest.fn(
    async (_jobid: string): Promise<QueryResult<JobAtributtes>> => {
      return {
        ...queryresults,
        rows: [
          {
            id: crypto.randomUUID(),
            company_id: crypto.randomUUID(),
            notes: "notes",
            description: "description",
            title: "title",
            location: "location",
            created_at: new Date().toString(),
            updated_at: new Date().toString(),
            status: "draft",
          },
        ],
      };
    }
  );

  updateJobStatus = jest.fn(
    async (_jobId: string, _status: AvailableStatusJobs): Promise<void> => {
      return;
    }
  );
  deleteJob = jest.fn(async (_jobId: string): Promise<void> => {
    return;
  });
}

export const PgClienteMock: PgClienteRepository = {
  //@ts-ignore
  client: connection,
  getConnection: jest.fn(async (): Promise<PoolClient> => {
    return "PoolClient" as unknown as PoolClient;
  }),
  beginTransaction: jest.fn(async (): Promise<void> => {}),
  commitTransaction: jest.fn(async (): Promise<void> => {}),
  rolbackTransaction: jest.fn(async (): Promise<void> => {}),
  end: jest.fn(async (connection: PoolClient): Promise<void> => {}),
};

export class OpenAiServiceMock implements ServiceOpenAI {
  openAPiClient = jest.mocked(axios);
  validateModeration = jest.fn(async (_text: string): Promise<boolean> => {
    return true;
  });
}

//deve ser o ultimo item exportado
export const mockEvenstDictionary: EventHandlerDictionary = {
  event_publish_job: new MockPublishJobEventHandler(),
  event_edit_job: new MockEditJobEventHandler(),
  event_delete_job: new MockDeleteJobEventHandler(),
};

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
