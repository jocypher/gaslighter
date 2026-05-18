import express from "express";
import "reflect-metadata";
import AppDatasource from "./db/datasource";
import dotenv from "dotenv"
import appRouter from "./api/index";
import { requestLogger } from "./core/middlewares/reqLoggerMiddlewares";


dotenv.config()

const app = express();
const PORT = 3000;


app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger)

app.use(appRouter)


AppDatasource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

    });
   
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });