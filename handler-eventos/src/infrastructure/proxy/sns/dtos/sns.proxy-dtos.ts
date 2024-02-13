export type EventBodyType<T> = {
  topico: string;
  versao: number;
  payload: T;
};

export interface SNSProxyOptions {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}
