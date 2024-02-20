import { Router } from "express";
import clusters from "node:cluster";
import { cpus } from "os";
import { app } from "./app/app.config";
import { configs } from "./envs/environments.config";
import AWSXRay from "aws-xray-sdk";
import http from "http";
import https from "https";

if (!configs.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(configs.PORT as string, 10);

const APP_NAME = "api-jobs";

if (["STAGE", "PRODUCTION"].includes(configs.NODE_ENV)) {
  app.use(AWSXRay.express.openSegment(APP_NAME));
  AWSXRay.middleware.enableDynamicNaming(APP_NAME);
  AWSXRay.captureHTTPsGlobal(http);
  AWSXRay.captureHTTPsGlobal(https);
}

interface AppRoutes {
  [x: string]: Router;
}

export function createApp(appRoutes: AppRoutes) {
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
    for (const [path, route] of Object.entries(appRoutes)) {
      app.use(path, route);
    }

    if (["STAGE", "PRODUCTION"].includes(configs.NODE_ENV)) {
      app.use(AWSXRay.express.closeSegment());
    }

    const server = app.listen(PORT, () => {
      console.log(
        `Process ${process.pid} started - Listening on port ${PORT}. ${process.env.NODE_ENV}`
      );
    });

    return server;
  }
}
