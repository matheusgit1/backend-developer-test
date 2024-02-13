export declare module "*.yml";
export declare module "*.yaml";

export declare global {
  export interface HttpResponse {
    statusCode: number;
    body?: any;
  }
}

export {};
