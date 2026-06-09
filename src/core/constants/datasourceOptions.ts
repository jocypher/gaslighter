import { DataSourceOptions } from 'typeorm';
import envConstants from './envConstants';

const datasourceOptions = (): DataSourceOptions => ({
  type: 'postgres',
  host: envConstants.DB.HOST,
  port: envConstants.DB.PORT,
  username: envConstants.DB.USERNAME,
  password: envConstants.DB.PASSWORD,
  database: envConstants.DB.NAME,
});

export default datasourceOptions;
