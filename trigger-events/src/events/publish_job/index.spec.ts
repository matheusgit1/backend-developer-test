import { queryresults } from "./../../../../api-jobs/src/tests/mocks";
import { connection } from "../../testes/testes.util";
import {
  AWSPortMock,
  JobModuleMock,
  OpenAiServiceMock,
  PgClienteMock,
} from "../../testes/class.mock";
import { PublishJobEventHandler } from "./index";
import { JobAtributtes } from "../../modules/__dtos__/modules.dtos";
import { FakeLogger } from "../../infrastructure/logger/fake-logger";

const fakeLogger = new FakeLogger(PublishJobEventHandler.name);

const pgClienteMock = new PgClienteMock();
const jobModuleMock = new JobModuleMock();
const openAiMock = new OpenAiServiceMock();
const awsPortMock = new AWSPortMock();
const handler = new PublishJobEventHandler(
  //@ts-ignore
  pgClienteMock,
  jobModuleMock as any,
  openAiMock,
  awsPortMock,
  fakeLogger
);

const bucketName = "global-feeds";
const key = "jobs/feed.json";

describe(`cenários de testes para ${PublishJobEventHandler.name}`, () => {
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

      openAiMock.validateModeration.mockResolvedValueOnce(true);
      jobModuleMock.getJob.mockResolvedValueOnce({
        ...queryresults,
        rowCount: 1,
        rows: [
          {
            id: jobId,
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

      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledTimes(1);
      expect(spy_awsPortMock_uploadObjectToS3).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_end).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
    });

    it("deve inserir job de mesmo id no s3", async () => {
      openAiMock.validateModeration.mockResolvedValueOnce(true);
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
      const date = new Date().toString();

      const newJobId = crypto.randomUUID();
      const newJob: JobAtributtes = {
        id: newJobId,
        company_id: "company_id",
        title: "title",
        description: "description",
        notes: "notes",
        location: "location",
        created_at: date,
        updated_at: date,
        status: "published",
      };

      jobModuleMock.getJob.mockResolvedValueOnce({
        ...queryresults,
        rowCount: 1,
        rows: [newJob],
      });

      const jobs: JobAtributtes = {
        id: jobId,
        company_id: "company_id",
        title: "title",
        description: "description",
        notes: "notes",
        location: "location",
        created_at: date,
        updated_at: date,
        status: "published",
      };

      awsPortMock.getObjectFroms3.mockResolvedValueOnce({
        Body: {
          toString: () => {
            return JSON.stringify({
              feeds: [jobs],
            });
          },
        },
      });

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

      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledTimes(1);
      expect(spy_awsPortMock_uploadObjectToS3).toHaveBeenCalledTimes(1);
      expect(spy_awsPortMock_uploadObjectToS3).toHaveBeenCalledWith({
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify({ feeds: [newJob, jobs] }),
      });

      expect(spy_jobModuleMock_updateJobStatus).toHaveBeenCalledTimes(1);
      expect(spy_jobModuleMock_updateJobStatus).toHaveBeenCalledWith(
        newJobId,
        "published"
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
      openAiMock.validateModeration.mockResolvedValueOnce(true);
      jobModuleMock.connection = connection;
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
