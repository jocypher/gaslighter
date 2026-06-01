import express from "express";
import "reflect-metadata";
import AppDatasource from "./db/datasource";
import dotenv from "dotenv"
import appRouter from "./api/index";
import { requestLogger } from "./core/middlewares/reqLoggerMiddlewares";
import { EthereumListenerService } from "./core/services/ethereum/ethereumListenerService";
import { seedAlertTypes,getCachedAlertTypes } from "./db/seeds/alertType.seed";
import client from "./core/config/redisConfig";
import "./core/workers"
import morgan from "morgan";


dotenv.config()

const app = express();
const PORT = 3000;


app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger)

app.use(appRouter)


AppDatasource.initialize()
  .then(async () => {
    console.log("Database connected successfully");
    await client.connect();
    
    await seedAlertTypes();

    await getCachedAlertTypes();
    
    
    app.listen(PORT, async() => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      const ethereumService = new EthereumListenerService()
      await ethereumService.startListening()
    });
   
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });
