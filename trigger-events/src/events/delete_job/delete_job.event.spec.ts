import { connection } from "../../testes/testes.util";
import {
  AWSPortMock,
  JobModuleMock,
  PgClienteMock,
} from "../../testes/class.mock";
import { DeleteJobEventHandler } from "./delete_job.event";
import { JobAtributtes } from "../../modules/__dtos__/modules.dtos";
import { FakeLogger } from "../../infrastructure/logger/fake-logger";

const pgClienteMock = new PgClienteMock();
const awsPortMock = new AWSPortMock();
const jobModuleMock = new JobModuleMock();
const fakeLogger = new FakeLogger(DeleteJobEventHandler.name);
const handler = new DeleteJobEventHandler(
  //@ts-ignore
  pgClienteMock,
  jobModuleMock as any,
  awsPortMock,
  fakeLogger
);

const bucketName = "global-feeds";
const key = "jobs/feed.json";

describe(`cenários de testes para ${DeleteJobEventHandler.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucessos", () => {
    it("deve executar operação com exito", async () => {
      const spy_awsPortMock_getObjectFroms3 = jest.spyOn(
        awsPortMock,
        "getObjectFroms3"
      );
      const spy_awsPortMock_uploadObjectToS3 = jest.spyOn(
        awsPortMock,
        "uploadObjectToS3"
      );

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
    });
  });

  it("deve remover job de mesmo id do evento do s3 se exisitr", async () => {
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
    expect(spy_pgClienteMock_end).toHaveBeenCalledTimes(1);
    expect(spy_pgClienteMock_getConnection).toHaveBeenCalledTimes(1);
    expect(spy_pgClienteMock_beginTransaction).toHaveBeenCalledTimes(1);
    expect(spy_pgClienteMock_rolbackTransaction).toHaveBeenCalledTimes(0);
    expect(spy_pgClienteMock_commitTransaction).toHaveBeenCalledTimes(1);
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
