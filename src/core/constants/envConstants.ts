import dotenv from "dotenv"
dotenv.config()

 const envConstants = {
   HOST: process.env.PG_HOST ?? "localhost",
   PORT: Number(process.env.PG_PORT) ?? 5432,
   USER: process.env.PG_USER ?? "",
   PASSWORD: process.env.PG_PASSWORD ?? "",
   DATABASE: process.env.PG_DATABASE ?? "",
   JWT_SECRET: process.env.JWT_SECRET ?? "",
   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",
   
   ALCHEMY_URL: {
     ETH: `${process.env.ALCHEMY_ETH_URL}/${process.env.ALCHEMY_API_KEY}`,
     POL: `${process.env.ALCHEMY_POL_URL}/${process.env.ALCHEMY_API_KEY}`,
   },
   WS_ALCHEMY_URL: {
     ETH: `${process.env.WS_ALCHEMY_ETH_URL}/${process.env.ALCHEMY_API_KEY}`,
     POL: `${process.env.WS_ALCHEMY_POL_URL}/${process.env.ALCHEMY_API_KEY}`,
   },
 };

export default envConstants