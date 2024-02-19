## API-JOBS

This service is part of the implementation of the 'backend challenge' solution, being the main service of the implemented architecture

![arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/architecture.png)

This service is responsible for the main CRUD operations regarding jobs

# Preparation

to run in a local environment it is necessary

- nodejs installed in version 20
- typescript
- insomnia for http requests (optional)
- postman for http requests (optional)
- docker (optional)

For local execution directly in the terminal, use the command below:

in development mode:

```bash
npm run start:dev
```

or

```bash
yarn start:dev
```

em produção:

```bash
npm run build && npm run start
```

or

```bash
yarn build && npm run start
```

if you want to run a docker container:

```bash
docker build -t api-jobs .
```

and finally

```bash
docker run -p 3000:3000 --name api-jobs api-jobs
```

**important: ** configure the environment variables according to the .env.example file

the variables ``URL_HANDLER_EVENTS`` and ``HANDLER_EVENTS_X_API_KEY`` are obtained with the deployment of the handler-eventos service

## Stacks

Typescript, JavaScript, Shell, Jest, autocannon

## Unit testing

To run unit tests, use the command lines below

```bash
npm run test:coverage
```

or

```bash
npm run test
```

or

```bash
yarn test:coverage
```

or

```bash
yarn test

```

**Important:** many tests were implemented, guarantee computational resources to execute general tests, otherwise run each isolated test as stated in the scripts in package.json

```bash
npm run test:usecase or\
npm run test:usecase:coverage or\
npm run test:modules or\
npm run test:modules:coverage or\
npm run test:controllers or\
npm run test:controllers:coverage
```

## Load test (simulated)

This service includes simulated load testing with autocannon, which can be adapted to a real scenario.

To run the load test with the fixed default configurations, run the commands below:

```bash
npm run autocannon:server
```

This will upload a mocked application for load testing

To run the test, run the command below:

```bash
npm run autocannon:test
```

The standard test lasts 10 seconds, simulates 300 simultaneous connections, and operates with all processing cores

*these variables and values can be changed in  ./src/@autocannon/test*

done this. A final test report is displayed:

![relatório](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/load-test-with-autocannon.png)

**important: ** in this example we have a heavier simulated scenario with high latency

to change this parameter change the variable latencia in ./src/@autocannon/server/routes.ts

## API documentation

API documentation made available in the service itself by accessing route /api-docs in an interactive swagger interface. Feel free to apply any tests you wish.

![docs](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/documentation.png)

![docs](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/documentation-2.png)

## About the author

I'm a full-stack developer, administration technician, automation engineer in training and data scientist in training. I always seek excellence and deliver the maximum with the highest quality, without, of course, neglecting good practices.

I am currently a full stack junior developer in the software development area, aiming to increase my seniority.

I have skills with the most modern stacks, such as: nodeJS, typeScript, css, html, nestJs, NextJs, aws-cloud, non-relational databases such as mongodb and redis, relational databases such as MySql, postgres, docker, unit tests and of integration. Also working in various sectors, such as education and telecommunications.

## Want to contact the developer?

🪜 Instagram (I always respond): @ap_matheus

📱 Phone and Whatsapp: 55 27 997822665

📫 Mail: pereira.matheusalves@gmail.com

🔗 Linkedin: https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/
