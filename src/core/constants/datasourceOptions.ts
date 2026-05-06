import { DataSourceOptions } from "typeorm";
import envConstants from "./envConstants";


const options =  {
    type: 'postgres' as const,
    port: envConstants.PORT,
    host: envConstants.HOST,
    username: envConstants.USERNAME,
    password: envConstants.PASSWORD,
    database: envConstants.DATABASE
}




const datasourceOptions = (): DataSourceOptions => options
export default datasourceOptions
