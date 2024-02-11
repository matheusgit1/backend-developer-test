import * as pg from "pg";
import { PgClienteRepository } from "../infrastructure/database/pg.repository";
import { NextFunction, Request, Response } from "express";
import { HandlerEventClass } from "src/infrastructure/services/dto/handler-event.dtos";
import axios, { AxiosInstance } from "axios";

export const mockRequest = {
  header: {},
  body: {},
  headers: {},
} as Request;

export const mockResponse = {
  send: (value: any) => value,
  json: (value: any) => value,
  status: (status: number) => {
    return {
      statusCode: status,
      json: (values: any) => values,
      send: (values: any) => values,
    };
  },
} as Response;

export const mockNextFunction = jest.fn() as NextFunction;

export const queryresults = {
  rowCount: 1,
  rows: [],
  oid: null,
  command: "command",
  fields: [
    {
      name: "name",
      tableID: 1,
      columnID: 1,
      dataTypeID: 1,
      dataTypeSize: 1,
      dataTypeModifier: 1,
      format: "format",
    },
  ],
};
export class PgClienteMock implements PgClienteRepository {
  getConnection = jest.fn(async (): Promise<pg.PoolClient> => {
    return "PoolClient" as unknown as pg.PoolClient;
  });

  beginTransaction = jest.fn(async (): Promise<void> => {});
  commitTransaction = jest.fn(async (): Promise<void> => {});
  rolbackTransaction = jest.fn(async (): Promise<void> => {});
  releaseTransaction = jest.fn(async (): Promise<void> => {});
  executeQuery = jest.fn(
    async (
      _Connection: pg.PoolClient,
      _query: string,
      _params?: any[]
    ): Promise<pg.QueryResult<any>> => {
      return { ...queryresults };
    }
  );
}

export class HandlerEventsMock implements HandlerEventClass {
  client: AxiosInstance = jest.mocked(axios);
  publishEvent = jest.fn(
    async (_topic: string, _version: 1, _payload: any): Promise<void> => {}
  );
}
