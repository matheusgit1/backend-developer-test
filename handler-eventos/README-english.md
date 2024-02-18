# Handler eventos

This service is part of the "back-end developer challenge"

The central objective of this service is to receive via http the publication of events issued by other services that emit some type of event to be handled by another service

example:

An action cannot be completed immediately, but it cannot prevent another from happening.

A use case within the service is:
When a job is published, it cannot be published immediately, nor can the client wait for a return while stuck in "loading"

for this, from outside asynchronously, the event is emitted and captured by the event-handler and handled

as the architecture below indicates:

![Arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/handler-events.png)

Below are some considerations before we test the application in your own environment, read them carefully.

## Initial considerations

As it is a serverless application, local validation must be done via unit testing, and load testing is unfeasible in this scenario.

Before proceeding to your AWS dashboard, create the following path in SSM

```bash
/develop/handler-eventos/api-key
```

add a value, it will be the api key (x-api-key).

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

**If you are doing this in an IAM account, don't forget to give the account resource access permission**

- cloudFormation
- cloudWatch
- lambda
- sns
- sqs
- ec2
- roles
- s3

... and others as necessary.

after deployment, in the aws console, retrieve the values of the api key and the generated endpoint, they will be variables of ``api-job``, as described in its documentation

## Stack utilizada

Typescript, JavaScript, Shell, Jest, IaC

## Teste unitários

To run unit tests, use the command lines below

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

## API documentation

#### Returns all available topics

```http
  GET /topicos
```

| Parâmetro  | Tipo       | Descrição                                  |
| :---------- | :--------- | :------------------------------------------- |
| `api_key` | `string` | **Mandatory**. Your API key in headers |

#### Returns a list of all topics created in dynamoDb

```JSON
{
    "sucesso": 1,
    "dados": {
        "0": {
            "topico": "event_edit_job",
            "versao": 1,
            "arn": "arn:aws:sns:us-east-1:963524133368:event_edit_job",
            "schema": {
                "job_id": {
                    "type": "string"
                },
                "origin": {
                    "type": "string"
                }
            }
        },
        "1": {
            "topico": "event_publish_job",
            "versao": 1,
            "arn": "arn:aws:sns:us-east-1:963524133368:event_publish_job",
            "schema": {
                "job_id": {
                    "type": "string"
                },
                "origin": {
                    "type": "string"
                }
            }
        },
        "2": {
            "topico": "event_delete_job",
            "versao": 1,
            "arn": "arn:aws:sns:us-east-1:963524133368:event_delete_job",
            "schema": {
                "job_id": {
                    "type": "string"
                },
                "origin": {
                    "type": "string"
                }
            }
        }
    }
}
```

```POST
  GET /sns/publicar
```

#### Publish an event on sns

| Parâmetro    | Tipo       | Descrição                        | Local                                                                                                                                                                |
| :------------ | :--------- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-api-key` | `string` | **Mandatory**. api key       | headers                                                                                                                                                              |
| `topico`    | `string` | **Mandatory**. sns topic     | body                                                                                                                                                                 |
| `versao`    | `number` | **Mandatory**. topic version | body                                                                                                                                                                 |
| `payload`   | `number` | **Mandatory**. event data    | body, it must be a json in the event format. The data for each topic is unique and can be obtained in the 'topics' route in the respective schema field of the event |

## About the author

I'm a full-stack developer, administration technician, automation engineer in training and data scientist in training. I always seek excellence and deliver the maximum with the highest quality, without, of course, neglecting good practices.

I am currently a full stack junior developer in the software development area, aiming for increasingly seniority.

I have skills with the most modern stacks, such as: nodeJS, typeScript, css, html, nestJs, NextJs, aws-cloud, non-relational databases such as mongodb and redis, relational databases such as MySql, postgres, docker, unit tests and of integration. Also working in various sectors, such as education and telecommunications.

## Want to contact the developer?

🪜 Instagram (I always respond): @ap_matheus

📱 Phone and whatsapp: 55 27 997822665

📫 Mail: pereira.matheusalves@gmail.com

🔗 Linkedin: https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/
