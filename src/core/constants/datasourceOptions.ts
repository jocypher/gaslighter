import { DataSourceOptions } from "typeorm";
import envConstants from "./envConstants";

const datasourceOptions = (): DataSourceOptions => ({
  type: "postgres",
  host: envConstants.HOST,
  port: envConstants.PORT,
  username: envConstants.USER,
  password: envConstants.PASSWORD,
  database: envConstants.DATABASE,
});

export default datasourceOptions;
