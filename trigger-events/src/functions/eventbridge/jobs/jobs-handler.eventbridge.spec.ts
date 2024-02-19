import { configs } from "../../../configs/envs.config";
import { TriggerFeedJobsByEventbridge } from "./jobs-handler.eventbridge";
import { AWSPortMock } from "../../../testes/class.mock";

const bucketName = configs.BUCKET_FEED_NAME;
const serviceBucketKey = configs.BUCKET_FEED_FILE_KEY;
const clientBucketKey = configs.BUCKET_FEED_CLIENT_FILE_KEY;

const awsPortMock = new AWSPortMock();
const service = new TriggerFeedJobsByEventbridge(awsPortMock as any);
describe(`cenários para ${TriggerFeedJobsByEventbridge.name}`, () => {
  describe("casos de sucesso", () => {
    it("deve executar update sem erros para os arquivos respectivos", async () => {
      const feeds = {
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
      };
      awsPortMock.getObjectFroms3.mockResolvedValueOnce({
        Body: {
          toString: () => {
            return JSON.stringify(feeds);
          },
        },
      });
      const spy_awsPortMock_getObjectFroms3 = jest.spyOn(
        awsPortMock,
        "getObjectFroms3"
      );
      const spy__awsPortMockuploadObjectToS3 = jest.spyOn(
        awsPortMock,
        "uploadObjectToS3"
      );
      await service.handler();
      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledTimes(1);
      expect(spy_awsPortMock_getObjectFroms3).toHaveBeenCalledWith({
        Bucket: bucketName,
        Key: serviceBucketKey,
      });
      expect(spy__awsPortMockuploadObjectToS3).toHaveBeenCalledTimes(1);
      expect(spy__awsPortMockuploadObjectToS3).toHaveBeenCalledWith({
        Bucket: bucketName,
        Key: clientBucketKey,
        Body: JSON.stringify(feeds),
      });
    });
  });
});
