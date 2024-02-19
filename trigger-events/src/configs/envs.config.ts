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
  URL_OPEN_AI: process.env.URL_OPEN_AI,
  KEY_OPEN_AI: process.env.KEY_OPEN_AI,
  MOCK_CALL_OPEN_AI: process.env.MOCK_CALL_OPEN_AI,
  MOCK_CALL_OPEN_AI_RESPONSE: process.env.MOCK_CALL_OPEN_AI_RESPONSE,
  BUCKET_FEED_NAME: process.env.BUCKET_FEED_NAME,
  BUCKET_FEED_FILE_KEY: process.env.BUCKET_FEED_FILE_KEY,
  BUCKET_FEED_CLIENT_FILE_KEY: process.env.BUCKET_FEED_CLIENT_FILE_KEY,
};
