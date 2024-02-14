import { Context, SQSEvent } from "aws-lambda";
import { Logger } from "../infrastructure/logger/logger";
import { v4 } from "uuid";
import {
  EventReceived,
  PublishJobDto,
} from "../functions/sqs/dtos/handlers.dto";

export const genSqsHandlerContext = (functionName: string): Context => {
  const logger = new Logger(genSqsHandlerContext.name);
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
    done(_error?: Error, _result?: any) {
      if (_error) {
        logger.error(String(_error));
      }
      logger.info(String(_result));
    },
    fail(_error: Error | string) {
      logger.error(String(_error));
    },
    succeed(_messageOrObject: any) {
      logger.error(String(_messageOrObject));
    },
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
    // Records: Array(size).fill({
    //   messageId: v4(),
    //   receiptHandle: "MessageReceiptHandle",
    //   body: genRecordBodyEvent(event),
    //   attributes: {
    //     ApproximateReceiveCount: "1",
    //     SentTimestamp: new Date().getTime().toString(),
    //     SenderId: "123456789012",
    //     ApproximateFirstReceiveTimestamp: "1523232000001",
    //   },
    //   messageAttributes: {},
    //   md5OfBody: "{{{md5_of_body}}}",
    //   eventSource: "aws:sqs",
    //   eventSourceARN: "arn:aws:sqs:us-east-1:123456789012:MyQueue",
    //   awsRegion: "us-east-1",
    // }),
  };
};

export const genEventPublishJob = (
  size: number
): Array<EventReceived<PublishJobDto>> => {
  return new Array(size).fill({
    topico: "publish_job",
    versao: 1,
    payload: {
      jobId: crypto.randomUUID().toString(),
    },
  });
};
