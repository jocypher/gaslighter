import dotenv from "dotenv"
dotenv.config()

 const envConstants = {
   HOST: process.env.PG_HOST ?? "localhost",
   PORT: Number(process.env.PG_PORT) ?? 5432,
   USER: process.env.PG_USER ?? "",
   PASSWORD: process.env.PG_PASSWORD ?? "",
   DATABASE: process.env.PG_DATABASE ?? "",
 };

export default envConstants