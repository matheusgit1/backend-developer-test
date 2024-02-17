import { CacheMock, FeedModuleMock } from "./../../tests/mocks";
import { StatusCodes } from "http-status-codes";
import { GetFeedUseCase } from "./getFeed.usecase";
import { FeedJobs } from "src/modules/__dtos__/modules.dtos";

const feedModuleMock = new FeedModuleMock();
const cacheMock = new CacheMock();
const usecase = new GetFeedUseCase(feedModuleMock, cacheMock as any);

const jobId = crypto.randomUUID();
const companyId = crypto.randomUUID();

const cacheKey = "feed-json";

describe(`executando testes para ${GetFeedUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucesso`, () => {
    it(`deve retornar status code ${StatusCodes.OK}`, async () => {
      const { statusCode, body } = await usecase.handler({} as any);
      expect(body).toBeDefined();
      expect(statusCode).toBe(StatusCodes.OK);
    });

    it(`deve retornar feed em cache se existir`, async () => {
      const jobsInFeed = [
        {
          company_id: companyId,
          id: jobId,
          status: "published",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          description: "Description",
          title: "Title",
          notes: "Notes",
          location: "Location",
        },
      ];
      cacheMock.get.mockReturnValueOnce(
        JSON.stringify({
          feeds: jobsInFeed,
        } as FeedJobs)
      );
      const spy_cacheMock_get = jest.spyOn(cacheMock, "get");
      const spy_cacheMock_set = jest.spyOn(cacheMock, "set");

      const spy_feedModuleMock_getFeed = jest.spyOn(feedModuleMock, "getFeed");

      const { statusCode, body } = await usecase.handler({} as any);
      console.log(body);
      expect(spy_cacheMock_get).toHaveBeenCalledTimes(1);
      expect(spy_cacheMock_get).toHaveBeenCalledWith(cacheKey);
      expect(spy_cacheMock_set).toHaveBeenCalledTimes(0);
      expect(spy_feedModuleMock_getFeed).toHaveBeenCalledTimes(0);
      expect(statusCode).toBe(StatusCodes.OK);
      expect(body.feeds).toEqual(jobsInFeed);
    });
  });

  it(`deve retornar feed do s3 se cache não existir, e criar novo cache`, async () => {
    const feedJobs: FeedJobs = {
      feeds: [
        {
          company_id: companyId,
          id: jobId,
          status: "published",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          description: "Description",
          title: "Title",
          notes: "Notes",
          location: "Location",
        },
      ],
    };
    cacheMock.get.mockReturnValueOnce(undefined);
    feedModuleMock.getFeed.mockResolvedValueOnce(feedJobs);
    const spy_cacheMock_get = jest.spyOn(cacheMock, "get");
    const spy_cacheMock_set = jest.spyOn(cacheMock, "set");

    const spy_feedModuleMock_getFeed = jest.spyOn(feedModuleMock, "getFeed");

    const { statusCode, body } = await usecase.handler({} as any);
    console.log(body);
    expect(spy_cacheMock_get).toHaveBeenCalledTimes(1);
    expect(spy_cacheMock_get).toHaveBeenCalledWith(cacheKey);
    expect(spy_cacheMock_set).toHaveBeenCalledTimes(1);
    expect(spy_cacheMock_set).toHaveBeenCalledWith(
      cacheKey,
      JSON.stringify(feedJobs),
      60 * 30
    );
    expect(spy_feedModuleMock_getFeed).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(StatusCodes.OK);
    expect(body).toBeDefined();
  });

  describe(`casos de erros`, () => {
    it("se busca de dados no s3 falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      cacheMock.get.mockReturnValueOnce(undefined);
      feedModuleMock.getFeed.mockRejectedValueOnce(new Error(message));
      const spy_cacheMock_get = jest.spyOn(cacheMock, "get");
      const spy_cacheMock_set = jest.spyOn(cacheMock, "set");

      const spy_feedModuleMock_getFeed = jest.spyOn(feedModuleMock, "getFeed");

      const res = await usecase.handler({} as any);

      expect(spy_cacheMock_get).toHaveBeenCalledTimes(1);
      expect(spy_cacheMock_set).toHaveBeenCalledTimes(0);
      expect(spy_feedModuleMock_getFeed).toHaveBeenCalledTimes(1);

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty("error");
    });
  });
});
