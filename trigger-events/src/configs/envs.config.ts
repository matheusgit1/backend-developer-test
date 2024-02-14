import * as dotenv from "dotenv";
dotenv.config();

export const configs = {
  TZ: process.env.TZ,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  URL_OPEN_API: process.env.URL_OPEN_API,
  KEY_OPEN_API_MODERATION: process.env.KEY_OPEN_API_MODERATION,
};
