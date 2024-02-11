import { Request, Response } from "express";

export class HealthUseCase {
  public async getHealth(req: Request, res: Response): Promise<any> {
    return res.send({
      status: "UP",
      moment: new Date().toLocaleString("pt-BR"),
    });
  }
}
