import * as dotenv from "dotenv";
dotenv.config();

import clusters from "node:cluster";
import { cpus } from "os";
import { routes as healthRoutes } from "./controllers/health/health.controller";
import { routes as companiecontroller } from "./controllers/companies/companies.controller";
import { routes as jobcontroller } from "./controllers/jobs/jobs.controller";
import { app } from "./configs/app/app.config";
import { configs } from "./configs/envs/environments.config";

if (!configs.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(configs.PORT as string, 10);

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
  app.use("/health", healthRoutes);
  app.use("/companies", companiecontroller);
  app.use("/job", jobcontroller);
  app.listen(PORT, () => {
    console.log(`Process ${process.pid} started - Listening on port ${PORT}`);
  });
}
