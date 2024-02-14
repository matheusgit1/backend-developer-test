import axios from "axios";
import type { AxiosInstance } from "axios";
import { Logger } from "../logger/logger";
import { configs } from "../../configs/envs.config";
import { OpenAiMOderationResponse } from "./dtos/services.dtos";

export class OpenAiService {
  public openAPiClient: AxiosInstance;
  constructor(
    private readonly logger: Logger = new Logger(OpenAiService.name)
  ) {
    this.openAPiClient = axios.create({
      baseURL: configs.URL_OPEN_API,
      timeout: 30 * 1000, // 30 seconds
      headers: {
        authorization: `Bearer ${configs.KEY_OPEN_API_MODERATION}`,
      },
    });
  }
  /**
   * Função que valida moderação de dados de entradas
   * @param {String} text
   * @returns {Promise<boolean>} retorna true se o job for moderado, e false se o job for potencialmente prejudicial
   */
  public async validateModeration(text: string): Promise<boolean> {
    try {
      const { data } = await this.openAPiClient.post("/moderations", {
        input: text,
      });
      const moderations: OpenAiMOderationResponse = data;
      for (const [_, isNotModerated] of Object.entries(
        moderations.results[0].categories
      )) {
        if (isNotModerated) {
          /***
           * se um dos atributos retornados pela open ai for verdadeiro, aquele atributo é potencialemente prejuducial
           */
          return false;
        }
      }
    } catch (e) {
      this.logger.error(`[validateModeration] - método processa com erro`, e);
      throw e;
    }
  }
}
