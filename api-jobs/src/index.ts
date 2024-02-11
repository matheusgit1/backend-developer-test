import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { routes as healthRoutes } from "./controllers/health.controller";
import { routes as companiecontroller } from "./controllers/companies.controller";
import { routes as jobcontroller } from "./controllers/jobs.controller";

if (!process.env.PORT) {
  process.exit(1);
}

console.log(process.env.DB_PASSWORD);

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/companies", companiecontroller);
app.use("/job", jobcontroller);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
