# Handler eventos

Este serviço faz parte do "desafio desenvolvedor back-end"

O objetivo central desse serviço é receber via http a publicação de eventos emitidos por outros serviços que emitem algum tipo de evento para ser tratado por outro serviço

exemplo:

Uma ação não pode ser concluída imediatamente, mas não pode ser impeditivo para outra aconteça.

Um caso de uso dentro do serviço é:
um job ao ser publicado, não pode ser publicado imediatamente, e nem o cliente pode esperar pelo retorno preso em um "loading"

para isso, de fora assincrona, o um evento é emitido e capturado pelo handler-eventos e tratado

como indica a arquitetura abaixo:

![Arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/handler-events.png)

Abaixo estão algumas considerações antes de testarmos a aplicação em seu próprio ambiente, leia-as com atenção.

## Considerações iniciais

Por se tratar de uma aplicação serverless validação local deve ser feita via testes unitário, e testes de cargas fica inviável nesse cenário.

antes de seguir no seu painel da aws, crie o seguinte caminho no ssm

```bash
/develop/handler-eventos/api-key
```

adicione um valor, será a chave da api (x-api-key).

modifique o arquivo ``values.yml`` com as configuração de conta, subnets e security group id.

**caso contrário deploy não será executado**

Para disponibilizar esse serviço no seu ambiente da aws, execute os comantos abaixo:

```bash
serverless config credentials --provider aws --key YOUR_KEY_GOES_HERE --secret YOUR_SECRET_KEY_GOES_HERE --overwrite
```

E, por fim:

```bash
serverless deploy
```

**Se você estiver fazendo isso em uma conta do IAM, não se esqueça de dar permissão de acesso ao recurso da conta**

- cloudFormation
- cloudWatch
- lambda
- sns
- sqs
- ec2
- roles
- s3

... e outros mais a medida do necessário.

após o deploy, no console da aws, recupere os valores da chave de api e do endpoint gerado, serão variais da ``api-job``, como descrito em sua documentação

## Stack utilizada

Typescript, JavaScript, Shell, Jest, IaC

## Teste unitários

Para execução dos testes unitários, use as linhas de comando abaixo

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

## Documentação da API

#### Retorna todos os tópicos disponiveis

```http
  GET /api/items
```

| Parâmetro  | Tipo       | Descrição                                            |
| :---------- | :--------- | :----------------------------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API nos headers |

#### Retorna uma listagem com todos os tópicos criados no dynamoDb

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

#### Publica um evento no sns

| Parâmetro    | Tipo       | Descrição                                | Local                                                                                                                                                             |
| :------------ | :--------- | :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-api-key` | `string` | **Obrigatório**. chave de api       | headers                                                                                                                                                           |
| `topico`    | `string` | **Obrigatório**. topico sns         | body                                                                                                                                                              |
| `versao`    | `number` | **Obrigatório**. versão do tópico | body                                                                                                                                                              |
| `payload`   | `number` | **Obrigatório**. dados do evento    | body, dever um json no formato do events. Os dados de cada tópico são singulares e podem ser obitidos na rota '/api/items' no campo schema respectivo do evento |

## Sobre o Autor

Sou desenvolvedor full-stack, técnico de administração, engenheiro de automação em formação e cientista de dados em formação. Busco sempre a excelência e entrego o máximo com a mais alta qualidade, sem, claro, deixar de lado as boas práticas.

Atualmente sou desenvolvedor júnior full stack na área de desenvolvimento de software, visando uma senioridade cada vez maior.

Tenho habilidades com as stacks mais modernas, como: nodeJS, typeScript, css, html, nestJs, NextJs, aws-cloud, bancos de dados não relacionais como mongodb e redis, bancos de dados relacionais como MySql, postgres, docker, testes unitários e de integração. Atuando também em diversos setores, como educação e telecomunicações.

## Quer entrar em contato com o desenvolvedor?

🪜 Instagram (sempre respondo): @ap_matheus

📱 Telefone e whatsapp: 55 27 997822665

📫 Email: pereira.matheusalves@gmail.com

🔗 Linkedin: https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/
