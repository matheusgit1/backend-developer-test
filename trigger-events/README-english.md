## Initial considerations

As it is a serverless application, local validation must be done via unit testing, and load testing is unfeasible in this scenario.

Before proceeding to your AWS panel, create the following path in SSM

database host

```bash
/develop/trigger-jobs/db-host
```

database user

```bash
/develop/trigger-jobs/db-user
```

database name

```bash
/develop/trigger-jobs/db-name
```

database password

```bash
/develop/trigger-jobs/db-password
```

url openAi - api de moderação

```bash
/develop/trigger-jobs/ulr-open-ai
```

chave de api - api de moderação da openAi

```bash
/develop/trigger-jobs/api-key-open-ai
```

For the purpose of controlling costs and unnecessary calls for each test to the openAi moderation API, the environment variable ``MOCK_CALL_OPEN_AI`` controls this simulation

If it is set to ``true`` the simulated return will be the value of the environment variable ``MOCK_CALL_OPEN_AI_RESPONSE``

if ``MOCK_CALL_OPEN_AI_RESPONSE`` is set to ``false``, it indicates that moderation failed and the job is potentially harmful,
if ``true`` moderation is accepted and job will be published in the s3 json file

modify the ``values.yml`` file with the account, subnets and security group id configurations.

**otherwise deploy will not be executed**

To make this service available in your AWS environment, run the commands below:

```bash
serverless config credentials --provider aws --key YOUR_KEY_GOES_HERE --secret YOUR_SECRET_KEY_GOES_HERE --overwrite
```

And finally:

```bash
serverless deploy
```

**If you are doing this in an IAM account, don't forget to give account resource access permission**

- cloudFormation
- cloudWatch
- lambda
- sns
- sqs
- ec2
- roles
- s3

... and others as necessary.

If you wanted to test in the AWS console, use the SQL template with the following json:

```JSON
{
  "Records": [
    {
      "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
      "receiptHandle": "MessageReceiptHandle",
      "body": "{\n  \"Type\" : \"Notification\",\n  \"MessageId\" : \"92d78051-10a7-5b78-ae4d-de19f165a5dc\",\n  \"TopicArn\" : \"arn:aws:sns:us-east-1:963524133368:event_delete_job\",\n  \"Message\" : \"{\\\"topico\\\":\\\"event_delete_job\\\",\\\"versao\\\":1,\\\"payload\\\":{\\\"job_id\\\":\\\"ffb49919-3fe6-4cb8-a52b-1d39d4000e64\\\",\\\"origin\\\":\\\"POSTMAN\\\"}}\",\n  \"Timestamp\" : \"2024-02-16T04:07:30.157Z\",\n  \"SignatureVersion\" : \"1\",\n  \"Signature\" : \"MHFfHjaZAF0xgBIwyq41upBVfPlltz4UmTNgNOTKVTB6akyiHeMZf1ATFgy30Cvrc2RIMicXpo1vNZ11Qx93AnPU2We90vKDlfINBCiWMLmsPEfm3rcGOKzsHgKnHQmpWSVwN3tQhn0UjlafeaaMfR8Nqf6bQsHYUzXgAouqFTa5HZUoZSJ7s4s91aKHdQmt4knqFw80vA4fHIgUCrGx4WsJ36kNrEqgnYU2CHBLE6XCPc+pd3uv0StmW2MRXWAg/pepbPOmJKpVeI1Djfiu0r3Q8feagWCcvnMYJSqMpJxDr6OAADslVqAtur3EuLxPcR/wYTObh64kGF0CTy7AQg==\",\n  \"SigningCertURL\" : \"https://sns.us-east-1.amazonaws.com/SimpleNotificationService-60eadc530605d63b8e62a523676ef735.pem\",\n  \"UnsubscribeURL\" : \"https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:963524133368:event_publish_job:c5e0dc93-1159-4a39-b1fe-4b046ddc27a4\"\n}",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1523232000000",
        "SenderId": "123456789012",
        "ApproximateFirstReceiveTimestamp": "1523232000001"
      },
      "messageAttributes": {},
      "md5OfBody": "{{{md5_of_body}}}",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-1:123456789012:MyQueue",
      "awsRegion": "us-east-1"
    }
  ]
}
```

**change the job_id field in Records[x].body to a valid job_id in the base**

## Stack utilizada

Typescript, JavaScript, Shell, Jest, IaC

## Teste unitários

Para executar testes de unidade, use as linhas de comando abaixo

```bash
npm run test:coverage
```

ou

```bash
npm run test
```

ou

```bash
yarn test:coverage
```

ou

```bash
yarn test

```

## About the author

I'm a full-stack developer, administration technician, automation engineer in training and data scientist in training. I always seek excellence and deliver the maximum with the highest quality, without, of course, neglecting good practices.

I am currently a full stack junior developer in the software development area, aiming for increasing seniority.

I have skills with the most modern stacks, such as: nodeJS, typeScript, css, html, nestJs, NextJs, aws-cloud, non-relational databases such as mongodb and redis, relational databases such as MySql, postgres, docker, unit tests and of integration. Also working in various sectors, such as education and telecommunications.

## Want to contact the developer?

🪜 Instagram (I always respond): @ap_matheus

📱 Phone and Whatsapp: 55 27 997822665

📫 MAil: pereira.matheusalves@gmail.com

🔗 Linkedin: https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/
