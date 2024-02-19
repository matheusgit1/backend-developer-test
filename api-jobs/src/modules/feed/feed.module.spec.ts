import { configs } from "../../configs/envs/environments.config";
import { AWSPortMock, S3 } from "../../tests/mocks";
import { FeedModule } from "./feed.module";

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
      const spy_awsPortMock_getObjectFroms3 = jest.spyOn(
        awsPortMock,
        "getObjectFroms3"
      );
      const res = await feedModule.getFeed();
      expect(res).toBeDefined();
      expect(res).toHaveProperty("feeds");
      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledTimes(1);
      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledWith({
        Bucket: configs.BUCKET_FEED_NAME,
        Key: configs.BUCKET_FEED_CLIENT_FILE_KEY,
      });
    });
  });

  describe("casos de erros", () => {
    it("deve lançar exceção de busca de feed falhar", async () => {
      const message = "erro";
      awsPortMock.getObjectFroms3.mockRejectedValueOnce(new Error(message));
      await expect(feedModule.getFeed()).rejects.toThrow(message);
    });
  });
});
