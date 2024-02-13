import swaggerUi from "swagger-ui-express";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import ymal from "yamljs";

const swaggerDocument = ymal.load("src/@documentation/docs.yaml");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serveFiles(swaggerDocument),
  swaggerUi.setup(swaggerDocument)
);

export { app };
