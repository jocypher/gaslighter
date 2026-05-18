import express from "express";
import "reflect-metadata";
import AppDatasource from "./db/datasource";
import dotenv from "dotenv"

dotenv.config()

const app = express();

app.use(express.json())


const PORT = 3000;

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