import { createClient } from "redis"

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: (times) => Math.min(times * 50, 2000)
  },
});

client.on("error", (error)=> console.log(`Redis client error `, error))


export default client