import { BaseUseCase } from "../usecases";
import type {Method} from 'axios'

export interface UsecasesDictionary {
  method: Method;
  path: string;
  usecase: BaseUseCase;
}

export type Usecases = UsecasesDictionary[];
