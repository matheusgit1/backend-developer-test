import axios from "axios";
import type { AxiosInstance } from "axios";
import { Logger } from "../logger/logger";
import { configs } from "../../configs/envs.config";
import {
  OpenAiModerationResponse as OpenAiModerationResponse,
  ServiceOpenAI,
} from "./__dtos__/services.dtos";

export class OpenAiService implements ServiceOpenAI {
  public openAPiClient: AxiosInstance;
  constructor(
    private readonly logger: Logger = new Logger(OpenAiService.name)
  ) {
    this.openAPiClient = axios.create({
      baseURL: configs.URL_OPEN_AI,
      timeout: 30 * 1000, // 30 seconds
      headers: {
        authorization: `Bearer ${configs.KEY_OPEN_AI}`,
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
      if (configs.MOCK_CALL_OPEN_AI === "true") {
        return configs.MOCK_CALL_OPEN_AI_RESPONSE === "false" ? false : true;
      }
      const { data } = await this.openAPiClient.post("/moderations", {
        input: text,
      });
      const moderations: OpenAiModerationResponse = data;
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
      return true;
    } catch (e) {
      this.logger.error(`[validateModeration] - método processa com erro`, e);
      throw e;
    }
  }
}
