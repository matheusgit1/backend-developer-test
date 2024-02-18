
## API-JOBS

Este serviço faz parte da implementação da solução do 'desafio backend' sendo o serviço principal da arquitetura implementada

![arquitetura](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/architecture.png)

Este serviço é responsável pelas operações CRUD principais com relação aos jobs


# Preparação

para execução em ambiente local é necessário 

- nodejs intalado na versão 20
- typescript
- insominia para requisiçoes http (opcional)
- postman para requisiçoes http (opcional)
- docker (opcional)

para execução local diretamente no terminal, use o camando abaixo:

em modo de desnvolvimento:

```bash
npm run start:dev
```
ou 

```bash
yarn start:dev
```

em produção:

```bash
npm run build && npm run start
```
ou 

```bash
yarn build && npm run start
```

caso queira executar um container do docker:

```bash
docker build -t api-jobs .
```
e, por fim

```bash
docker run -p 3000:3000 --name api-jobs api-jobs
```


**importante: ** configure as variaveis de ambientes de acordo com a arquivo .env.example

as variaveis ```URL_HANDLER_EVENTS``` e ```HANDLER_EVENTS_X_API_KEY``` são obtidas com o deploy do serviço handler-eventos
## Stack utilizada

Typescript, JavaScript, Shell, Jest, autocannon


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

**Importantes:** muitos testes foram implementadas, garanta recursos computacionais para execução dos testes gerais, caso o contrario execute cada teste isolado como consta nos scripts no package.json

```bash
npm run test:usecase or\
npm run test:usecase:coverage or\
npm run test:modules or\
npm run test:modules:coverage or\
npm run test:controllers or\
npm run test:controllers:coverage
```


## Teste de carga (simulado)

Este serviço conta com teste de cargas com autocannon de forma simulada, sedo possível adapta-lo para um cenário real.

para executar o teste de carga com as configuração padrões fixas, execute os comandos abaixo:

```bash
npm run autocannon:server
```
isso irá subir uma aplicação mockada para testes de cargas


para executar o teste, execute o comando abaixo:


```bash
npm run autocannon:test
```

o teste padrão dura 10 segundos, simula 300 conexões simultanes, e opera com todas os nucleos do processamento

*estas variaveis e valores podem ser alteradas em ./src/@autocannon/test*

feito isso. um relatório final do teste é exibido:

![relatório](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/load-test-with-autocannon.png)

**iportante: ** nesse exemplo temos um cenário mais pesado simulado com alta latencia

para alterar esse parametro mude a variavel latencia em ./src/@autocannon/server/routes.ts


## Documentação da API

Documentação da api disponibilizada no próprio serviço acessando a rora /api-docs em uma interface swagger interativa. Fique a vontada para aplicar os testes que desseja.

![docs](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/documentation.png)

![docs](https://github.com/matheusgit1/backend-developer-test/blob/Matheus_Alves_Pereira/assets/documentation-2.png)

## Sobre o autor

Sou desenvolvedor full-stack, técnico em administração, engenheiro de automação em formação e cientista de dados em formação. Busco sempre a excelência e entrego o máximo com a mais alta qualidade, sem, claro, descuidar das boas práticas.

Atualmente sou desenvolvedor júnior full stack na área de desenvolvimento de software, visando aumentar a senioridade.

Tenho habilidades com as stacks mais modernas, como: nodeJS, typeScript, css, html, nestJs, NextJs, aws-cloud, bancos de dados não relacionais como mongodb e redis, bancos de dados relacionais como MySql, postgres, docker, testes unitários e de integração. Atuando também em diversos setores, como educação e telecomunicações.



## Quer entrar em contato com o desenvolvedor?


🪜 Instagram (eu sempre respondo): @ap_matheus

📱 Telefone e Whatsapp: 55 27 997822665

📫 Email: pereira.matheusalves@gmail.com

🔗 Linkedin: https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/


