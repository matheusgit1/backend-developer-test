import { Response } from "express";

export const adaptRoute = async (
  handler: (...args: any[]) => Promise<HttpResponse>,
  res: Response
) => {
  const response = await handler();
  res.status(response.statusCode).json(response.body);
};
