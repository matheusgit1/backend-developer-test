import * as dotenv from "dotenv";
dotenv.config();

import { routes as healthRoutes } from "./controllers/health/health.controller";
import { routes as companiecontroller } from "./controllers/companies/companies.controller";
import { routes as jobcontroller } from "./controllers/jobs/jobs.controller";
import { app } from "./configs/app/app.config";
import { configs } from "./configs/envs/environments.config";

if (!configs.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(configs.PORT as string, 10);

app.use("/health", healthRoutes);
app.use("/companies", companiecontroller);
app.use("/job", jobcontroller);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
