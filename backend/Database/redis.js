import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redisServer = null;
let isRedisConnected = false;

if (!process.env.REDIS_URL) {
  console.warn("REDIS_URL not found !!!");
} else {
  redisServer = new Redis(process.env.REDIS_URL, {
    lazyConnect: true, 
    retryStrategy(times) {
      if (times > 3) {
        console.error("❌ Redis retry limit reached. Stopping retries.");
        return null; 
      }
      return Math.min(times * 2000, 5000);
    },
    reconnectOnError(err) {
      console.error("Redis reconnect error:", err.message);
      return false; 
    },
  });
  redisServer.on("connect", () => {
    isRedisConnected = true;
    console.log("✅ Redis connected");
  });
  redisServer.on("error", (err) => {
    if (isRedisConnected) {
      console.error("Redis error:", err.message);
    }
    isRedisConnected = false;
  });
  redisServer.on("end", () => {
    console.warn("⚠️ Redis connection closed");
    isRedisConnected = false;
  });

  redisServer
    .connect()
    .catch(() => {
      console.warn("⚠️ Redis not available. App will continue without Redis.");
      redisServer = null;
    });
}

export default redisServer;