# JOBS API

Desafio do desenvolvedor back-end

O desafio é criar um sistema de catálogo de anúncios de emprego com algumas premissas básicas descritas no leia-me

A solução implementada para resolver o problema está descrita na figura abaixo

![Arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/architecture.png)

Abaixo estão algumas considerações antes de testarmos a aplicação em seu próprio ambiente, leia-as com atenção

## Considerações iniciais

Por se tratar de um sistema baseado em microsserviços e eventos, devemos preparar o ambiente para receber e publicar eventos, e os eventos devem ser definidos para que outros microsserviços saibam o que estão recebendo de forma padronizada. events, projetado para validar o que é recebido com um esquema bem definido armazenado no serviço DynamoDB, em uma tabela "handler_eventos".

O serviço por sua vez encaminhará os eventos para o sns,
Pensando em um cenário de escalabilidade, outros serviços podem assinar o tópico e processar os eventos em paralelo com outros serviços em um cenário futuro

- Passo 1

no DynamoDB crie uma tabela chamada 'handler_eventos'

- Passo 2

crie três tópicos no sns com os seguintes nomes: event_delete_job, event_edit_job e event_publish_job

**save the 'arn' values of each topic**

- Passo 3

na tabela 'handler_eventos' no dinamoDB crie três itens com o mesmo nome dos tópicos sns criados anteriormente com o seguinte esquema json

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

para cada item substitua o 'arn' pelo arn do tópico sns criado anteriormente

- step 4

configura uma vpc com suas respectivas sub-redes, ela deve conter uma sub-rede privada vinculada a um gateway e um gateway interno, e um grupo de segurança com o tipo de protocolo de entrada e saída e vinculado à vpc.
Salve os valores da sub-rede pública e privada, eles serão usados para configurar aplicação serverless

## Sobre os serviços

Por se tratar de uma arquitetura de microsserviços, não é possível documentar cada um aqui, mas todos os serviços possuem documentação própria

### api-jobs:

- Português:
- Inglês

### handler-events:

- Português:
- Inglês

### trigger-events:

- Português:
- Inglês

## Stack utilizada

Docker, Typescript, JavaScript, Shell, Jest, AWS, Autocannon

## Teste unitários

Todos os serviços possuem testes unitários para garantir integridade e cobertura da aplicação e são robustos em integração contínua e entrega contínua (ci/cd)

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

## Arquitetura Implementada

### Arquitetura Geral do Projeto

![Arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/architecture.png)

## Sobre o Autor

Sou desenvolvedor full-stack, técnico de administração, engenheiro de automação em formação e cientista de dados em formação. Busco sempre a excelência e entrego o máximo com a mais alta qualidade, sem, claro, deixar de lado as boas práticas.

Atualmente sou desenvolvedor júnior full stack na área de desenvolvimento de software, visando uma senioridade cada vez maior.

Tenho habilidades com as stacks mais modernas, como: nodeJS, typeScript, css, html, nestJs, NextJs, aws-cloud, bancos de dados não relacionais como mongodb e redis, bancos de dados relacionais como MySql, postgres, docker, testes unitários e de integração. Atuando também em diversos setores, como educação e telecomunicações.

## Quer entrar em contato com o desenvolvedor?

🪜 Instagram (sempre respondo): @ap_matheus

📱 Telefone e whatsapp: 55 27 997822665

📫 Email: pereira.matheusalves@gmail.com

🔗 Linkedin: https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/
