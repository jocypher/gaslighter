import { DataSource } from "typeorm"
import datasourceOptions from "../core/constants/datasourceOptions"
import { User } from "./entities/User"
import { AlertHistory } from "./entities/AlertHistory"
import { AlertRule } from "./entities/AlertRule"
import { AlertType } from "./entities/AlertType"



const AppDatasource = new DataSource({
    ...datasourceOptions(),
    synchronize: true,
    logging: false,
    entities: [User ,AlertHistory,AlertRule,AlertType]
})




export default AppDatasource