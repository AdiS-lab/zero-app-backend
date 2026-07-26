import dotenv from "dotenv";
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

interface IConfig {
  port: number;
  appMode: "DEV" | "PROD" | "STAGING";
  mongoUri: string;
  accessTokenSecret: string
  accessTokenTtl:  SignOptions['expiresIn'];
  refreshTokenSecret: string
  refreshTokenTtl:  SignOptions['expiresIn'];
}

const config = {
  port: Number(process.env.PORT) || 8000,
  appMode: (process.env.APP_MODE as "DEV" | "PROD" | "STAGING") || "DEV",
  mongoUri: process.env[`${process.env.APP_MODE}_MONGO_URI`] || "",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || undefined,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || undefined,
};

export default config as IConfig;

// PORT=8000
// APP_MODE=DEV # DEV | PROD | STAGING

// DEV_MONGO_URI=mongodb://localhost:27017/adi-zero-project
// STAGING_MONGO_URI=mongodb://mongo:27017/adi-zero-project
// PROD_MONGO_URI=<atlas connection string>

// ACCESS_TOKEN_SECRET=REALLY_SECRET
// ACCESS_TOKEN_TTL=1d
// REFRESH_TOKEN_SECRET=REALLY_REALLY_SECRET
// REFRESH_TOKEN_TTL=7d
