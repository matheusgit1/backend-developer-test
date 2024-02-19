import { BaseUseCase } from "../usecases";

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";
export interface UsecasesDictionary {
  method: Method;
  path: string;
  usecase: BaseUseCase;
}

export type Usecases = UsecasesDictionary[];
