import * as dotenv from "dotenv";
dotenv.config();

import { app } from "../../configs/app/app.config";
import { companyroutes, feedRoutes, healthroutes, jobroutes } from "./routes";
import { NextFunction, Request, Response } from "express";
import clusters from "node:cluster";
import { cpus } from "os";

const PORT: number = 3001;

const loggermiddleware = (req: Request, _res: Response, next: NextFunction) => {
  console.log(
    `Endpoint: ${req.originalUrl}. Method: ${
      req.method
    }. Body: ${JSON.stringify(req.body)}. \nProcess id: ${process.pid}`
  );
  next();
};

if (clusters.isPrimary) {
  console.log(`Primary cluster ${process.pid} is running`);

  for (let i = 0; i < cpus().length; i++) {
    clusters.fork();
  }

  clusters.on("exit", (worker, code, signal) => {
    console.log(
      `Adjacent cluster ${worker.process.pid} stoped.\nReason code: ${code}.\nsignal: ${signal}`
    );
  });
} else {
  app.use("/health", loggermiddleware, healthroutes);
  app.use("/companies", loggermiddleware, companyroutes);
  app.use("/job", loggermiddleware, jobroutes);
  app.use("/feed", loggermiddleware, feedRoutes);

  app.listen(PORT, () => {
    console.log(`Process ${process.pid} started - Listening on port ${PORT}`);
  });
}
