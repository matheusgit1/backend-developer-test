# JOBS API

Backend developer challenge

The challenge is to create a job advertisement catalog system with some basic premises described in the readme

The solution implemented to solve the problem is described in the figure below

![Arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/architecture.png)

Below are some considerations before we test the app in your own environment, read them carefully

Frontend:
Api de compras:
Api de produtos:

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

- Portuguese
- English

### handler-events:

- Portuguese
- English

### trigger-events:

- Portuguese
- English

## Stack utilizada

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



## Documentação da API

### Teste

#### Valida se o serviço está operacional

```http
  GET /
```

Retorno esperado:

```JSON
Hello World!
```

#### Autenticacao

```http
  POST /auth/login/
```

body da requisição no formato JSON

| Parâmetro   | Tipo       | Descrição                              |
| :----------- | :--------- | :--------------------------------------- |
| `username` | `string` | **Obrigatório**. nome de usuario  |
| `password` | `string` | **Obrigatório**. senha de usuario |

Retorno esperado:

```JSON
{
    "access_token":"access_token"
}
```

Token de acesso usado nas rotas autenticadas.
use o header

```JSON
"Authorization": "Bearer  \"access_token\""
```

Todas as rotas abaixo são autenticadas

### Produtos

#### Cria um produto na base

```http
  POST /products/
```

body da requisição no formato JSON

| Parâmetro      | Tipo       | Descrição                                    |
| :-------------- | :--------- | :--------------------------------------------- |
| `name`        | `string` | **Obrigatório**. nome de produto        |
| `description` | `string` | **Obrigatório**. descrição de produto |
| `image_url`   | `string` | **Obrigatório**. imagem do produto      |
| `price`       | `number` | **Obrigatório**. Preço do produto      |

Retorno esperado:

```JSON
{
    "name": "produto 1",
    "description": "descrição produto 1",
    "image_url": "image_url",
    "price": 2,
    "id": "1edf0461-8a8a-48a2-9641-0512686dfc7b"
}
```

#### Lista todos os produtos

```http
  GET /products/
```

body da requisição no formato JSON

Retorno esperado:

```JSON
[
    {
        "id": "03810712-ea47-4892-90ee-ea8528246d59",
        "name": "produto 1",
        "description": "descrição produto 1",
        "image_url": "image_url",
        "price": 2,
        "active_status": true
    },
    {
        "id": "1edf0461-8a8a-48a2-9641-0512686dfc7b",
        "name": "produto 1",
        "description": "descrição produto 1",
        "image_url": "image_url",
        "price": 2,
        "active_status": true
    }
]
```

#### Lista um produto por id

```http
  GET /products/:product_id
```

**product_id** deve ser passado como parametro da url

Retorno esperado:

```JSON
{
    "id": "03810712-ea47-4892-90ee-ea8528246d59",
    "name": "produto 1",
    "description": "descrição produto 1",
    "image_url": "image_url",
    "price": 2,
    "active_status": true
}
```

#### Atualiza um produto na base

```http
  PATCH /products/:product_id
```

**product_id** deve ser passado como parametro da url

| Parâmetro      | Tipo       | Descrição                                |
| :-------------- | :--------- | :----------------------------------------- |
| `name`        | `string` | **Opcional**. nome de produto        |
| `description` | `string` | **Opcional**. descrição de produto |
| `image_url`   | `string` | **Opcional**. imagem do produto      |
| `price`       | `number` | **Opcional**. Preço do produto      |

Retorno esperado:

```JSON
{
    "generatedMaps": [],
    "raw": [],
    "affected": 1
}
```

#### Deleta um produto na base

```http
  DELETE /products/:product_id
```

**product_id** deve ser passado como parametro da url

Retorno esperado:

```JSON

```

No content

### Ordens (compras)

#### Cria uma ordem de comrpra

```http
  POST /orders/
```

body da requisição no formato JSON

| Parâmetro    | Tipo       | Descrição                                         |
| :------------ | :--------- | :-------------------------------------------------- |
| `card_hash` | `string` | **Obrigatório**. hash de cartão de crédito |
| `items`     | `Array`  | **Obrigatório**. array de items              |

items devem ter o seguinte formato

| `quantity`      | `number` | **Obrigatório**. quantidade de items |
| `product_id`      | `string` | **Obrigatório**. id de produto |

exemplo

```JSON
{
    "card_hash":"card_hash",
    "items": [
        {
            "quantity": 7,
            "product_id": "03810712-ea47-4892-90ee-ea8528246d59"
        },
        {
            "quantity": 1,
            "product_id": "1edf0461-8a8a-48a2-9641-0512686dfc7b"
        },
        {
            "quantity": 12,
            "product_id": "2546c91a-b96b-4894-beb3-67791a3e023c"
        },
        {
            "quantity": 10,
            "product_id": "27b219cc-ee83-44fb-b649-34abf520fddd"
        }
    ]
}

```

Retorno esperado:

```JSON

```

No content

#### Listar todas as ordems

```http
  GET /orders/
```

retorno esperado

```JSON
[
    {
        "status": "pending",
        "id": "901dffdc-64bc-4b4c-8eaf-bd840d349a9d",
        "total": "204.00",
        "client_id": 1,
        "created_at": "2024-02-01T02:00:09.365Z"
    },
    {
        "status": "pending",
        "id": "af71029e-d564-44dc-b6bd-d406cc0395d5",
        "total": "236.00",
        "client_id": 1,
        "created_at": "2024-02-01T02:00:24.945Z"
    }
]

```

#### Listar uma unica ordem

```http
  GET /orders/:order_id
```

**order_id** deve ser passado como parametro da url

retorno esperado

```JSON
{
    "status": "pending",
    "id": "901dffdc-64bc-4b4c-8eaf-bd840d349a9d",
    "total": "204.00",
    "client_id": 1,
    "created_at": "2024-02-01T02:00:09.365Z"
}
```

#### add(num1, num2)

Recebe dois números e retorna a sua soma.
