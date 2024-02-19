import { Response } from "express";

/**
 * @description esta função faz o bypass entre o usucase e as rotas dos controlles. O controller não pode ter acesso direto ao usecase, para isso, use essa função de adaptação
 * @param { (...args: any[]) => Promise<HttpResponse>} handler
 * @param { Response } res
 */
export const adaptRoute = async (
  handler: (...args: any[]) => Promise<HttpResponse>,
  res: Response
) => {
  const response = await handler();
  res.status(response.statusCode).json(response.body);
};
