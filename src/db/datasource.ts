import { DataSource } from "typeorm"
import datasourceOptions from "../core/constants/datasourceOptions"



const AppDatasource = new DataSource({
    ...datasourceOptions(),
    synchronize: true,
})



export default AppDatasource