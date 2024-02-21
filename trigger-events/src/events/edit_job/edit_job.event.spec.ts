import { connection } from "../../testes/testes.util";
import {
  AWSPortMock,
  JobModuleMock,
  OpenAiServiceMock,
  PgClienteMock,
} from "../../testes/class.mock";
import { EditJobEventHandler } from "./edit_job.event";
import { JobAtributtes } from "../../modules/__dtos__/modules.dtos";
import { FakeLogger } from "../../infrastructure/logger/fake-logger";
import { JobEntity } from "../../entities/job/job.entity";
const fakeLogger = new FakeLogger(EditJobEventHandler.name);

const pgClienteMock = new PgClienteMock();
const jobModuleMock = new JobModuleMock();
const openAiMock = new OpenAiServiceMock();
const awsPortMock = new AWSPortMock();
const handler = new EditJobEventHandler(
  //@ts-ignore
  pgClienteMock,
  jobModuleMock as any,
  openAiMock,
  awsPortMock,
  fakeLogger
);

const bucketName = "global-feeds";
const key = "jobs/feed.json";

describe(`cenários de testes para ${EditJobEventHandler.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucessos", () => {
    it("deve executar operação com exito", async () => {
      const jobId = crypto.randomUUID();
      const spy_awsPortMock_getObjectFroms3 = jest.spyOn(
        awsPortMock,
        "getObjectFroms3"
      );
      const spy_awsPortMock_uploadObjectToS3 = jest.spyOn(
        awsPortMock,
        "uploadObjectToS3"
      );
      const spy_pgClienteMock_end = jest.spyOn(pgClienteMock, "end");
      const spy_pgClienteMock_getConnection = jest.spyOn(
        pgClienteMock,
        "getConnection"
      );
      const spy_pgClienteMock_beginTransaction = jest.spyOn(
        pgClienteMock,
        "beginTransaction"
      );
      const spy_pgClienteMock_rolbackTransaction = jest.spyOn(
        pgClienteMock,
        "rolbackTransaction"
      );
      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      jobModuleMock.getJob.mockResolvedValueOnce(
        new JobEntity({
          id: jobId,
          company_id: "company",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          description: "description",
          title: "title",
          notes: "notes",
          location: "location",
          status: "published",
        })
      );

      jobModuleMock.connection = connection;
      const res = await handler.handler({
        topico: "topico",
        versao: 1,
        payload: {
          job_id: jobId,
          origin: "test jest",
        },
      });

      expect(res).toBeUndefined();

      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledTimes(0);
      expect(spy_awsPortMock_uploadObjectToS3).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_end).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
    });

    it("deve remover job de mesmo id do s3 se existir se a moderação for false", async () => {
      openAiMock.validateModeration.mockResolvedValueOnce({
        reason: "moderation",
        isModerated: false,
      });
      const jobId = crypto.randomUUID();
      const spy_awsPortMock_getObjectFroms3 = jest.spyOn(
        awsPortMock,
        "getObjectFroms3"
      );
      const spy_awsPortMock_uploadObjectToS3 = jest.spyOn(
        awsPortMock,
        "uploadObjectToS3"
      );
      const spy_pgClienteMock_end = jest.spyOn(pgClienteMock, "end");
      const spy_pgClienteMock_getConnection = jest.spyOn(
        pgClienteMock,
        "getConnection"
      );
      const spy_pgClienteMock_beginTransaction = jest.spyOn(
        pgClienteMock,
        "beginTransaction"
      );
      const spy_pgClienteMock_rolbackTransaction = jest.spyOn(
        pgClienteMock,
        "rolbackTransaction"
      );
      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );

      const spy_jobModuleMock_updateJobStatus = jest.spyOn(
        jobModuleMock,
        "updateJobStatus"
      );

      jobModuleMock.getJob.mockResolvedValueOnce(
        new JobEntity({
          id: jobId,
          company_id: "company",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          description: "description",
          title: "title",
          notes: "notes",
          location: "location",
          status: "published",
        })
      );

      const jobs: JobAtributtes[] = [
        {
          id: jobId,
          company_id: "company_id",
          title: "title",
          description: "description",
          notes: "notes",
          location: "location",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          status: "published",
        },
      ];

      awsPortMock.getObjectFroms3.mockResolvedValueOnce({
        Body: {
          toString: () => {
            return JSON.stringify({
              feeds: jobs,
            });
          },
        },
      });

      const res = await handler.handler({
        topico: "topico",
        versao: 1,
        payload: {
          job_id: jobId,
          origin: "test jest",
        },
      });

      expect(res).toBeUndefined();

      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledTimes(1);
      expect(spy_awsPortMock_uploadObjectToS3).toHaveBeenCalledTimes(1);
      expect(spy_awsPortMock_uploadObjectToS3).toHaveBeenCalledWith({
        Body: JSON.stringify({ feeds: jobs.filter((job) => job.id != jobId) }),
        Bucket: bucketName,
        Key: key,
      });

      expect(spy_jobModuleMock_updateJobStatus).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_updateJobStatus).toHaveBeenCalledWith(
        jobId,
        "rejected"
      );
      expect(spy_pgClienteMock_end).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("casos de erros", () => {
    it("deve executar rollback se atualização no s3 falhar", async () => {
      const spy_awsPortMock_getObjectFroms3 = jest.spyOn(
        awsPortMock,
        "getObjectFroms3"
      );
      const spy_awsPortMock_uploadObjectToS3 = jest.spyOn(
        awsPortMock,
        "uploadObjectToS3"
      );
      const spy_pgClienteMock_end = jest.spyOn(pgClienteMock, "end");
      const spy_pgClienteMock_getConnection = jest.spyOn(
        pgClienteMock,
        "getConnection"
      );
      const spy_pgClienteMock_beginTransaction = jest.spyOn(
        pgClienteMock,
        "beginTransaction"
      );
      const spy_pgClienteMock_rolbackTransaction = jest.spyOn(
        pgClienteMock,
        "rolbackTransaction"
      );
      const spy_pgClienteMock_commitTransaction = jest.spyOn(
        pgClienteMock,
        "commitTransaction"
      );
      awsPortMock.uploadObjectToS3.mockRejectedValueOnce(new Error());
      openAiMock.validateModeration.mockResolvedValueOnce({
        reason: "moderation",
        isModerated: false,
      });

      const jobId = crypto.randomUUID();
      const res = await handler.handler({
        topico: "topico",
        versao: 1,
        payload: {
          job_id: jobId,
          origin: "test jest",
        },
      });

      expect(res).toBeUndefined();

      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledTimes(1);
      expect(spy_awsPortMock_uploadObjectToS3).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_end).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(0);
    });
  });
});
