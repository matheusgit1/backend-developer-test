import { CacheMock, FeedModuleMock } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { GetFeedUseCase } from "../../usecases/feed/getFeed.usecase";
import { Usecases } from "../shareds";
import { FeedRoutesAdapted } from "./feed.controller";
import request from "supertest";
import { app } from "../../configs/app/app.config";

const feedModuleMock = new FeedModuleMock();
const cache = new CacheMock();

const usecases: Usecases = [
  {
    path: "/",
    method: "get",
    usecase: new GetFeedUseCase(feedModuleMock, cache as unknown as any),
  },
];

const { routes } = new FeedRoutesAdapted(usecases);

app.use("/", routes);

describe(`testes para ${FeedRoutesAdapted.name}`, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucessos`, () => {
    it("deve executar '/' com sucesso", async () => {
      const { body, status } = await request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.OK);
    });
  });

  describe(`casos de erros`, () => {
    it(`deve executar '/' com erro ${StatusCodes.INTERNAL_SERVER_ERROR} se busca de dados no s3 falhar`, async () => {
      const message = "erro mockado";
      feedModuleMock.getFeed.mockRejectedValueOnce(new Error(message));
      const { body, status } = await request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(body).toBeDefined();
      expect(status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
