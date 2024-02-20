import * as dotenv from "dotenv";

dotenv.config();

export const configs = {
  NODE_ENV: process.env.NODE_ENV,
  TZ: process.env.TZ,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  URL_HANDLER_EVENTS: process.env.URL_HANDLER_EVENTS,
  HANDLER_EVENTS_X_API_KEY: process.env.HANDLER_EVENTS_X_API_KEY,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
  BUCKET_FEED_NAME: process.env.BUCKET_FEED_NAME,
  BUCKET_FEED_FILE_KEY: process.env.BUCKET_FEED_FILE_KEY,
  BUCKET_FEED_CLIENT_FILE_KEY: process.env.BUCKET_FEED_CLIENT_FILE_KEY,
};
