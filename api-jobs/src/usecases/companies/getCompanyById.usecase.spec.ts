import { StatusCodes } from "http-status-codes";
import { CompanyModuleMock, PgClienteMock } from "../../tests/mocks";
import { GetCompanyByIdUseCase } from "./getCompanyById.usecase";
import * as crypto from "crypto";
import { PoolClient } from "pg";

const pgClientMock = new PgClienteMock();
const companyModuleMock = new CompanyModuleMock();
const usecase = new GetCompanyByIdUseCase(pgClientMock, companyModuleMock);
const companyId = crypto.randomUUID().toString();

describe(`executando testes para ${GetCompanyByIdUseCase.name}`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });
  jest.useRealTimers();
  describe(`casos de sucesso`, () => {
    it(`deve retornar status code 200 e dados de empresas cadastradas`, async () => {
      const res = await usecase.handler({
        req: {
          params: {
            company_id: companyId,
          },
        },
      } as any);
      expect(res).toBeDefined();
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
    });

    it(`deve executar ações na base corretamente`, async () => {
      const spy_pgClientMock_getConnection = jest.spyOn(
        pgClientMock,
        "getConnection"
      );
      const spy_pgClientMock_beginTransaction = jest.spyOn(
        pgClientMock,
        "beginTransaction"
      );
      const spy_pgClientMock_commitTransaction = jest.spyOn(
        pgClientMock,
        "commitTransaction"
      );
      const spy_pgClientMock_executeQuery = jest.spyOn(
        pgClientMock,
        "executeQuery"
      );
      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_companyModuleMock_getCompanies = jest.spyOn(
        companyModuleMock,
        "getCompanies"
      );

      const spy_companyModuleMock_getCompanyById = jest.spyOn(
        companyModuleMock,
        "getCompanyById"
      );

      const { statusCode, body } = await usecase.handler({
        req: {
          params: {
            company_id: companyId,
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_getConnection).toHaveBeenCalledWith();

      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);

      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);

      expect(spy_companyModuleMock_getCompanyById).toHaveBeenCalledTimes(1);

      expect(spy_companyModuleMock_getCompanies).toHaveBeenCalledTimes(0);

      expect(statusCode).toBe(StatusCodes.OK);
    });
  });

  describe(`casos de erros`, () => {
    it("se metodo de conexão de base falhar, usecase deve retornar erro", async () => {
      const message = "erro mockado";
      pgClientMock.getConnection.mockRejectedValueOnce(new Error(message));
      const spy_pgClientMock_getConnection = jest.spyOn(
        pgClientMock,
        "getConnection"
      );
      const spy_pgClientMock_beginTransaction = jest.spyOn(
        pgClientMock,
        "beginTransaction"
      );
      const spy_pgClientMock_commitTransaction = jest.spyOn(
        pgClientMock,
        "commitTransaction"
      );
      const spy_pgClientMock_executeQuery = jest.spyOn(
        pgClientMock,
        "executeQuery"
      );
      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_companyModuleMock_getCompanies = jest.spyOn(
        companyModuleMock,
        "getCompanies"
      );

      const spy_companyModuleMock_getCompanyById = jest.spyOn(
        companyModuleMock,
        "getCompanyById"
      );

      const { statusCode, body } = await usecase.handler({
        req: {
          params: {
            company_id: companyId,
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_getConnection).toHaveBeenCalledWith();

      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);

      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(0);

      expect(spy_companyModuleMock_getCompanyById).toHaveBeenCalledTimes(0);

      expect(spy_companyModuleMock_getCompanies).toHaveBeenCalledTimes(0);

      expect(statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(body).toHaveProperty("error");
    });

    it("se metodo getCompanyById falhar, usecase deve executar rollback e encerrar conexão", async () => {
      const message = "erro mockado";
      companyModuleMock.getCompanyById.mockRejectedValueOnce(
        new Error(message)
      );

      const spy_pgClientMock_getConnection = jest.spyOn(
        pgClientMock,
        "getConnection"
      );
      const spy_pgClientMock_beginTransaction = jest.spyOn(
        pgClientMock,
        "beginTransaction"
      );
      const spy_pgClientMock_commitTransaction = jest.spyOn(
        pgClientMock,
        "commitTransaction"
      );
      const spy_pgClientMock_executeQuery = jest.spyOn(
        pgClientMock,
        "executeQuery"
      );
      const spy_pgClientMock_releaseTransaction = jest.spyOn(
        pgClientMock,
        "releaseTransaction"
      );
      const spy_pgClientMock_rolbackTransaction = jest.spyOn(
        pgClientMock,
        "rolbackTransaction"
      );

      const spy_companyModuleMock_getCompanies = jest.spyOn(
        companyModuleMock,
        "getCompanies"
      );

      const spy_companyModuleMock_getCompanyById = jest.spyOn(
        companyModuleMock,
        "getCompanyById"
      );

      const { statusCode, body } = await usecase.handler({
        req: {
          params: {
            company_id: companyId,
          },
        },
      } as any);

      expect(spy_pgClientMock_getConnection).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_getConnection).toHaveBeenCalledWith();

      expect(spy_pgClientMock_beginTransaction).toHaveBeenCalledTimes(0);

      expect(spy_pgClientMock_commitTransaction).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_releaseTransaction).toHaveBeenCalledTimes(1);
      expect(spy_pgClientMock_executeQuery).toHaveBeenCalledTimes(0);
      expect(spy_pgClientMock_rolbackTransaction).toHaveBeenCalledTimes(1);

      expect(spy_companyModuleMock_getCompanyById).toHaveBeenCalledTimes(1);

      expect(spy_companyModuleMock_getCompanies).toHaveBeenCalledTimes(0);

      expect(statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(body).toHaveProperty("error");
    });

    it(`se company_id não for informado, deve retornar status code ${StatusCodes.BAD_REQUEST}`, async () => {
      const { statusCode, body } = await usecase.handler({
        req: {
          params: {
            // company_id: companyId,
          },
        },
      } as any);

      expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(body).toHaveProperty("error");
    });
  });
});
