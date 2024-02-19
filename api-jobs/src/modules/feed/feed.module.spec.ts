import { AWSPortMock, S3 } from "../../tests/mocks";
import { FeedJobs } from "../__dtos__/modules.dtos";
import { FeedModule } from "./feed.module";
import * as AWS from "aws-sdk";

const awsPortMock = new AWSPortMock();
const feedModule = new FeedModule(awsPortMock);

describe(`cenários de testes para ${FeedModule.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe("casos de sucessos", () => {
    it("deve excutar getFeed corretamente", async () => {
      const res = await feedModule.getFeed();
      expect(res).toBeDefined();
      expect(res).toHaveProperty("feeds");
    });
  });
});
