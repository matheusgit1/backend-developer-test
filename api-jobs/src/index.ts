import * as dotenv from "dotenv";
dotenv.config();

import clusters from "node:cluster";
import { cpus } from "os";
import { routes as healthRoutes } from "./controllers/health/health.controller";
import { routes as companiecontroller } from "./controllers/companies/companies.controller";
import { routes as jobcontroller } from "./controllers/jobs/jobs.controller";
import { routes as feedcontroller } from "./controllers/feed/feed.controller";
import { app } from "./configs/app/app.config";
import { configs } from "./configs/envs/environments.config";
import AWSXRay from "aws-xray-sdk";
import http from "http";
import https from "https";

if (!configs.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(configs.PORT as string, 10);

const APP_NAME = "api-jobs";

app.use(AWSXRay.express.openSegment(APP_NAME));

// Habilida o mapeamento dinamico de endpont, podendo ser o nome
// da aplicacao ou o padrao de endpoint '*.exemplo.com' se por possivel
AWSXRay.middleware.enableDynamicNaming(APP_NAME);

//faz captura de requisicoes externas HTTP
AWSXRay.captureHTTPsGlobal(http);

//faz captura de requisicoes externas HTTPS
AWSXRay.captureHTTPsGlobal(https);

if (clusters.isPrimary) {
  console.log(`Primary cluster ${process.pid} is running`);

  for (let i = 0; i < cpus().length; i++) {
    clusters.fork();
  }

  clusters.on("exit", (worker, code, signal) => {
    console.log(
      `Adjacent cluster ${worker.process.pid} stoped.\nReason code: ${code}.\nsignal: ${signal}`
    );
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(
        `cluster ${worker.process.pid} stoped. Rescheduling another one`
      );
      clusters.fork();
    }
  });
} else {
  app.use("/health", healthRoutes);
  app.use("/companies", companiecontroller);
  app.use("/job", jobcontroller);
  app.use("/feed", feedcontroller);

  app.use(AWSXRay.express.closeSegment());

  const server = app.listen(PORT, () => {
    console.log(`Process ${process.pid} started - Listening on port ${PORT}`);
  });

  process.on("SIGTERM", () => {
    server.close();
  });
}
