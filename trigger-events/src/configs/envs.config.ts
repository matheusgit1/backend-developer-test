import * as dotenv from "dotenv";
dotenv.config();

export const configs = {
  URL_OPEN_API: process.env.URL_OPEN_API,
  KEY_OPEN_API_MODERATION: process.env.KEY_OPEN_API_MODERATION,
};
