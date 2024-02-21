import type { AxiosInstance } from "axios";
export interface OpenAiModerationResponse {
  id: string;
  model: string;
  results: [
    {
      flagged: boolean;
      categories: {
        sexual: boolean;
        hate: boolean;
        harassment: boolean;
        "self-harm": boolean;
        "sexual/minors": boolean;
        "hate/threatening": boolean;
        "violence/graphic": boolean;
        "self-harm/intent": boolean;
        "self-harm/instructions": boolean;
        "harassment/threatening": boolean;
        violence: boolean;
      };
      category_scores: {
        sexual: number;
        hate: number;
        harassment: number;
        "self-harm": number;
        "sexual/minors": number;
        "hate/threatening": number;
        "violence/graphic": number;
        "self-harm/intent": number;
        "self-harm/instructions": number;
        "harassment/threatening": number;
        violence: number;
      };
    }
  ];
}

export interface ModerationResponse {
  isModerated: boolean;
  reason: string;
}

export declare class ServiceOpenAI {
  constructor(...args: any[]);

  /**
   * Função que valida moderação de dados de entradas
   * @param {String} text
   * @returns {Promise<boolean>} retorna true se o job for moderado, e false se o job for potencialmente prejudicial
   */
  validateModeration(text: string): Promise<ModerationResponse>;
}
