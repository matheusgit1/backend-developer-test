## Considerações iniciais

Por se tratar de uma aplicação serverless validação local deve ser feita via testes unitário, e testes de cargas fica inviável nesse cenário.

antes de seguir no seu painel da aws, crie os seguintes caminho no ssm

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

Para fins de controle de custos e chamadas desnecessárias a cada teste a api de moderação da openAi a variavel de ambiente ``MOCK_CALL_OPEN_AI`` controla essa simulção

caso esteja setada como ``true`` o retorno simulado será o valor da variavel de ambiente ``MOCK_CALL_OPEN_AI_RESPONSE``

caso ``MOCK_CALL_OPEN_AI_RESPONSE`` esteja como ``false``, indica que a moderação falhou e o job e portencialmente prejudicial,
se for ``true`` a moderação fi aceita e job será publicado no arquivo json do s3

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

caso, queria testar no console da aws, use o template do sqs com o seguintes json:

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

**altere o campo job_id em Records[x].body para um jobid válido na base**

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

## Sobre o autor

Sou desenvolvedor full-stack, técnico em administração, engenheiro de automação em formação e cientista de dados em formação. Busco sempre a excelência e entrego o máximo com a mais alta qualidade, sem, claro, descuidar das boas práticas.

Atualmente sou desenvolvedor júnior full stack na área de desenvolvimento de software, visando cada vez mais senioridade.

Tenho habilidades com as stacks mais modernas, como: nodeJS, typeScript, css, html, nestJs, NextJs, aws-cloud, bancos de dados não relacionais como mongodb e redis, bancos de dados relacionais como MySql, postgres, docker, testes unitários e de integração. Atuando também em diversos setores, como educação e telecomunicações.

## Quer entrar em contato com o desenvolvedor?

🪜 Instagram (eu sempre respondo): @ap_matheus

📱 Telefone e Whatsapp: 55 27 997822665

📫 Email: pereira.matheusalves@gmail.com

🔗 Linkedin: https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/
