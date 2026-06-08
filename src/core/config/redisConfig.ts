import { createClient } from "redis"
import envConstants from "../constants/envConstants";

const client = createClient({
  socket: {
    ...envConstants.REDIS_OPTIONS,
    reconnectStrategy: (times) => Math.min(times * 50, 2000)
  },
});

client.on("error", (error)=> console.log(`Redis client error `, error))


export default client