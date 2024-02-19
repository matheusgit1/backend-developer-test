import { Context, SQSEvent } from "aws-lambda";
import { v4 } from "uuid";
import {
  EventReceived,
  PublishJobDto,
} from "../functions/sqs/events/__dtos__/handlers.dto";
import { QueryResult } from "pg";

export const queryresults: QueryResult<any> = {
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

export const connection = {
  //@ts-ignore
  query: async (_quer: string, _params: any[]): Promise<QueryResult> => {
    return { ...queryresults };
  },
};

export const genSqsHandlerContext = (functionName: string): Context => {
  const currentmillis = new Date().getTime();
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: functionName,
    functionVersion: "v1",
    invokedFunctionArn: "SQS::ARN",
    memoryLimitInMB: "1024MB",
    awsRequestId: v4(),
    logGroupName: "log-group-mock",
    logStreamName: "log-stream-mock",
    getRemainingTimeInMillis() {
      return new Date().getTime() - currentmillis;
    },
    done(_error?: Error, _result?: any) {},
    fail(_error: Error | string) {},
    succeed(_messageOrObject: any) {},
  };
};

export const genRecordBodyEvent = (event: any) => {
  return JSON.stringify({
    Type: "Notification",
    MessageId: "MessageId",
    TopicArn: "TopicArn",
    Message: JSON.stringify(event),
    Timestamp: new Date().toString(),
    SignatureVersion: "1",
    Signature: "Signature",
    SigningCertURL: "SigningCertURL",
    UnsubscribeURL: "UnsubscribeURL",
  });
};

export const genSqsEvents = (event: any[]): SQSEvent => {
  return {
    Records: event.map((record) => ({
      messageId: v4(),
      receiptHandle: "MessageReceiptHandle",
      body: genRecordBodyEvent(record),
      attributes: {
        ApproximateReceiveCount: "1",
        SentTimestamp: new Date().getTime().toString(),
        SenderId: "123456789012",
        ApproximateFirstReceiveTimestamp: "1523232000001",
      },
      messageAttributes: {},
      md5OfBody: "{{{md5_of_body}}}",
      eventSource: "aws:sqs",
      eventSourceARN: "arn:aws:sqs:us-east-1:123456789012:MyQueue",
      awsRegion: "us-east-1",
    })),
  };
};

export const genEventPublishJob = (
  size: number
): Array<EventReceived<PublishJobDto>> => {
  return new Array(size).fill({
    topico: "event_publish_job",
    versao: 1,
    payload: {
      jobId: crypto.randomUUID().toString(),
    },
  });
};
