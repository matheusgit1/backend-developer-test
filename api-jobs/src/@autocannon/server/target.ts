import * as dotenv from "dotenv";
dotenv.config();

import { app } from "../../configs/app/app.config";
import { helthroutes, companyroutes, jobroutes, feedRoutes } from "./routes";
import { NextFunction, Request, Response } from "express";

const PORT: number = 3001;

const loggermiddleware = (req: Request, _res: Response, next: NextFunction) => {
  console.log(
    `Endpoint: ${req.originalUrl}. Method: ${
      req.method
    }. Body: ${JSON.stringify(req.body)}`
  );
  next();
};

app.use("/health", loggermiddleware, helthroutes);
app.use("/companies", loggermiddleware, companyroutes);
app.use("/job", loggermiddleware, jobroutes);
app.use("/feed", loggermiddleware, feedRoutes);

app.listen(PORT, () => {
  console.log(`Process ${process.pid} started - Listening on port ${PORT}`);
});
