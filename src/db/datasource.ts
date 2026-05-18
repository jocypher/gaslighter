import { DataSource } from "typeorm"
import datasourceOptions from "../core/constants/datasourceOptions"
import { User } from "./entities/User"



const AppDatasource = new DataSource({
    ...datasourceOptions(),
    synchronize: true,
    entities: [User]
})



export default AppDatasource