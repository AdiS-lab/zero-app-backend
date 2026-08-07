import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

interface IConfig {
  port: number;
  appMode: 'DEV' | 'PROD' | 'STAGING';
  mongoUri: string;
  accessTokenSecret: string;
  accessTokenTtl: SignOptions['expiresIn'];
  refreshTokenSecret: string;
  refreshTokenTtl: SignOptions['expiresIn'];
  email: string;
  password: string;
}

const config = {
  port: Number(process.env.PORT) || 8000,
  appMode: (process.env.APP_MODE as 'DEV' | 'PROD' | 'STAGING') || 'DEV',
  mongoUri: process.env[`${process.env.APP_MODE}_MONGO_URI`] || '',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || undefined,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || undefined,
  email: process.env.EMAIL || '',
  password: process.env.PASSWORD || '',
};

export default config as IConfig;
