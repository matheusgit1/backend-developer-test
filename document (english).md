# JOBS API

Backend developer challenge

The challenge is to create a job advertisement catalog system with some basic premises described in the readme

The solution implemented to solve the problem is described in the figure below

![Arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/architecture.png)

Below are some considerations before we test the app in your own environment, read them carefully

## Initial Considerations

As it is a system based on microservices and events, we must prepare the environment to receive and publish events, and events must be defined so that other microservices know what they are receiving in a standardized way. events was developed, designed to validate what is received with a well-defined schema stored in the dynamoDB service, in a "handler_eventos" table.

The service in turn will forward the events to sns,
Thinking about a scalability scenario, other services can subscribe to the topic and process the events in parallel with other services in a future scenario

- step 1

in DynamoDB create a table called 'handler_eventos'

- step 2

create three topics on sns with the following names: event_delete_job, event_edit_job e event_publish_job

**save the 'arn' values of each topic**

- step 3

in the 'handler_eventos' table in dynamoDB create three items with the same name as the sns topics created previously with the following json schema

```JSON
{
  "topico": {
    "S": "event_publish_job"
  },
  "versao": {
    "N": "1"
  },
  "arn": {
    "S": "arn:sns:values"
  },
  "schema": {
    "M": {
      "job_id": {
        "M": {
          "type": {
            "S": "string"
          }
        }
      },
      "origin": {
        "M": {
          "type": {
            "S": "string"
          }
        }
      }
    }
  }
}
```

for each item replace the 'arn' with the arn of the previously created sns topic

- step 4

configures a vpc with its respective subnets, it must contain a private subnet linked to a gateway and an internal gateway, and a security group with the type of input and output protocol and linked to the vpc.
Save the public and private subnet values, these will be used to configure serverless applications

## About services

As it is a microservices architecture, it is not possible to document each one here, but all services have their own documentation

### api-jobs:

- Portuguese: https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/api-jobs/README-portuguese.md
- English: https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/api-jobs/README-english.md

### handler-events:

- Portuguese: https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/handler-eventos/README-portuguese.md
- English: https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/handler-eventos/README-english.md

### trigger-events:

- Portuguese
- English

## Stacks

Docker, Typescript, JavaScript, Shell, Jest, AWS, Autocannon

## Unitary tests

All services have unit tests to ensure integrity and application coverage and are robust in continuous integration and continuous delivery (ci/cd)

```bash
npm run test:coverage
```

or

```bash
npm run test
```

ou

```bash
yarn test:coverage
```

or

```bash
yarn test

```

## Implemented architecture

### General project architecture

![Arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/architecture.png)

## Sobre o Autor

I am a full-stack developer, administration technician, automation engineer in training, and data scientist in training. I always strive for excellence and deliver the maximum with the highest quality, without, of course, leaving aside good practices.

I am currently a junior full stack developer in the software development area, targeting increasingly higher seniority.

I have skills with the most modern stacks, such as: nodeJS, typeScript, css, html, nestJs, NextJs, aws-cloud, non-relational databases such as mongodb and redis, relational databases such as MySql, postgres, docker, unit tests and of integration. Also working in different sectors, such as education and telecommunications.

## Want to contact the developer?

🪜 Instagram (I always respond): @ap_matheus

📱 Phone and whatsapp: 55 27 997822665

📫 Mail: pereira.matheusalves@gmail.com

🔗 Linkedin: https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/
