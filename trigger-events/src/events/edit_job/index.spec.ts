import { OpenAiService } from "../../infrastructure/services/open-ia.service";
import { PgClient } from "../../infrastructure/database/cliente/pg.cliente";
import { EditJobEventHandler } from ".";
import { JobModule } from "../../modules/jobs/jobs.modules";
import * as AWS from "aws-sdk";


const pgClient = new PgClient();
const jobModule = new JobModule();
const openAiService = new OpenAiService();
// const fakeLogger = new FakeLogger("PublishEventHandler");
const s3 = jest.mocked(new AWS.S3());

const handler = new EditJobEventHandler(
  // pgClient,
  jobModule,
  openAiService,
  s3
  // fakeLogger
);

describe("casos do publish evetica", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("sucessos", () => {
    it("taffdads", async () => {
      const res = await handler.handler({
        topico: "publish",
        versao: 1,
        payload: {
          job_id: "2eecdec7-e1e4-40e0-a2dc-b2bffe5a1fca",
          origin: "jest",
        },
      });
      expect(res).toBeUndefined();
    });
  });
});
