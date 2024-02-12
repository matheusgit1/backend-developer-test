import { BaseUseCase } from "../usecases";

export interface UsecasesDictionary {
  method: "get" | "head" | "post" | "delete" | "put";
  path: string;
  usecase: BaseUseCase;
}

export type Usecases = UsecasesDictionary[];
