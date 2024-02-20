import { createApp } from "./configs/config";

import { routes as jobrooutes } from "./controllers/jobs/jobs.controller";
import { routes as companyroutes } from "./controllers/companies/companies.controller";
import { routes as healthroutes } from "./controllers/health/health.controller";
import { routes as feedroutes } from "./controllers/feed/feed.controller";

const server = createApp({
  "/health": healthroutes,
  "/companies": companyroutes,
  "/job": jobrooutes,
  "/feed": feedroutes,
});

process.on("SIGTERM", () => {
  server.close();
});
