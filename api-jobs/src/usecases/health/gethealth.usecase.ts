import { BaseUseCase } from "..";

export class GetHealthUseCase implements BaseUseCase {
  public async handler(): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {
        status: "UP",
        moment: new Date().toLocaleString("pt-BR"),
      },
    };
  }
}
