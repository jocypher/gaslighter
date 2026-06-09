import dotenv from 'dotenv';
dotenv.config();

const envConstants = {
  APP_NAME: process.env.app || '',
  DB: {
    HOST: process.env.PG_HOST || 'localhost',
    PORT: Number(process.env.PG_PORT) || 5432,
    USERNAME: process.env.PG_USER || '',
    PASSWORD: process.env.PG_PASSWORD || '',
    NAME: process.env.PG_DATABASE || '',
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || '',
    EXPIRES_IN: '1d',
  },

  ALCHEMY_URL: {
    ETH: `${process.env.ALCHEMY_ETH_URL}/${process.env.ALCHEMY_API_KEY}`,
    POL: `${process.env.ALCHEMY_POL_URL}/${process.env.ALCHEMY_API_KEY}`,
  },
  WS_ALCHEMY_URL: {
    ETH: `${process.env.WS_ALCHEMY_ETH_URL}/${process.env.ALCHEMY_API_KEY}`,
    POL: `${process.env.WS_ALCHEMY_POL_URL}/${process.env.ALCHEMY_API_KEY}`,
  },
  REDIS_OPTIONS: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  QUEUE_OPTIONS: {
    LIMITER: {
      MAX: 1,
      DURATION: 1000,
    },
  },
  SMTP: {
    HOST: process.env.SMTP_HOST || '',
    PORT: Number(process.env.SMTP_PORT) || 587,
    USERNAME: process.env.SMTP_USERNAME,
    PASSWORD: process.env.SMTP_PASSWORD,
  },
};

export default envConstants;
