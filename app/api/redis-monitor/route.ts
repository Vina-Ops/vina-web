import { NextRequest, NextResponse } from "next/server";

// Redis client (you'll need to install redis package)
// npm install redis @types/redis
import { createClient } from "redis";

// Create Redis client with connection from environment variables
const getRedisClient = () => {
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_CONNECTION_STRING;

  if (!redisUrl) {
    throw new Error(
      "Redis connection string not found in environment variables"
    );
  }

  return createClient({
    url: redisUrl,
    // Add connection options for better reliability
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
      connectTimeout: 10000,
    },
  });
};

// Redis monitoring data interface
interface RedisMonitorData {
  info: Record<string, any>;
  memory: {
    used: string;
    peak: string;
    fragmentation: string;
  };
  clients: {
    connected: number;
    blocked: number;
  };
  stats: {
    totalConnections: number;
    instantaneousOps: number;
    keyspace: Record<string, any>;
  };
  keys: {
    total: number;
    byType: Record<string, number>;
    sample: string[];
  };
  performance: {
    latency: number;
    uptime: string;
    version: string;
  };
}

// GET /api/redis-monitor - Get Redis monitoring data
export async function GET(request: NextRequest) {
  try {
    const client = getRedisClient();

    // Connect to Redis
    await client.connect();

    // Get Redis INFO
    const info = await client.info();
    const infoObj = parseRedisInfo(info);

    // Get client list
    const clientList = await client.clientList();
    const clients = {
      connected: clientList.length,
      blocked: clientList.filter((client) => client.flags.includes("b")).length,
    };

    // Get database info
    const dbSize = await client.dbSize();

    // Get sample keys
    const sampleKeys = await client.keys("*");
    const keyTypes = await getKeyTypes(client, sampleKeys.slice(0, 100));

    // Get Redis configuration
    const config = await client.configGet("*");

    // Calculate performance metrics
    const latency = await measureLatency(client);

    const monitorData: RedisMonitorData = {
      info: infoObj,
      memory: {
        used: formatBytes(parseInt(infoObj.used_memory || "0")),
        peak: formatBytes(parseInt(infoObj.used_memory_peak || "0")),
        fragmentation: infoObj.mem_fragmentation_ratio || "0",
      },
      clients: {
        connected: parseInt(infoObj.connected_clients || "0"),
        blocked: parseInt(infoObj.blocked_clients || "0"),
      },
      stats: {
        totalConnections: parseInt(infoObj.total_connections_received || "0"),
        instantaneousOps: parseInt(infoObj.instantaneous_ops_per_sec || "0"),
        keyspace: infoObj.keyspace || {},
      },
      keys: {
        total: dbSize,
        byType: keyTypes,
        sample: sampleKeys.slice(0, 20),
      },
      performance: {
        latency: latency,
        uptime: formatUptime(parseInt(infoObj.uptime_in_seconds || "0")),
        version: infoObj.redis_version || "Unknown",
      },
    };

    await client.disconnect();

    return NextResponse.json({
      success: true,
      data: monitorData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Redis monitoring error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/redis-monitor - Execute Redis commands (for management)
export async function POST(request: NextRequest) {
  try {
    const { action, command, key, value } = await request.json();

    // Security: Only allow safe commands
    const allowedCommands = [
      "FLUSHDB",
      "FLUSHALL",
      "DEL",
      "EXPIRE",
      "TTL",
      "TYPE",
      "GET",
      "SET",
      "INFO",
      "PING",
      "DBSIZE",
      "KEYS",
      "EXISTS",
      "HGET",
      "HSET",
      "HGETALL",
      "LLEN",
      "LRANGE",
      "SCARD",
      "SMEMBERS",
      "CLIENT",
    ];

    if (!allowedCommands.includes(command?.toUpperCase())) {
      return NextResponse.json(
        {
          success: false,
          error: "Command not allowed",
        },
        { status: 403 }
      );
    }

    const client = getRedisClient();
    await client.connect();

    let result;

    switch (action) {
      case "execute":
        if (command === "GET" && key) {
          result = await client.get(key);
        } else if (command === "SET" && key && value) {
          result = await client.set(key, value);
        } else if (command === "DEL" && key) {
          result = await client.del(key);
        } else if (command === "FLUSHDB") {
          result = await client.flushDb();
        } else if (command === "FLUSHALL") {
          result = await client.flushAll();
        } else if (command === "INFO") {
          const infoSection = key || "all";
          result = await client.info(infoSection);
        } else if (command === "PING") {
          result = await client.ping();
        } else if (command === "DBSIZE") {
          result = await client.dbSize();
        } else if (command === "KEYS") {
          const pattern = key || "*";
          result = await client.keys(pattern);
        } else if (command === "EXISTS" && key) {
          result = await client.exists(key);
        } else if (command === "HGET" && key && value) {
          result = await client.hGet(key, value);
        } else if (command === "HSET" && key && value) {
          // For HSET, value should be a JSON object
          const fieldValue = JSON.parse(value);
          result = await client.hSet(key, fieldValue);
        } else if (command === "HGETALL" && key) {
          result = await client.hGetAll(key);
        } else if (command === "LLEN" && key) {
          result = await client.lLen(key);
        } else if (command === "LRANGE" && key && value) {
          const [start, end] = value.split(" ").map(Number);
          result = await client.lRange(key, start, end);
        } else if (command === "SCARD" && key) {
          result = await client.sCard(key);
        } else if (command === "SMEMBERS" && key) {
          result = await client.sMembers(key);
        } else if (command === "CLIENT") {
          // Handle CLIENT commands like CLIENT KILL TYPE pubsub
          if (key === "KILL" && value) {
            const killType = value.toUpperCase();
            if (killType === "TYPE PUBSUB") {
              result = await client.sendCommand([
                "CLIENT",
                "KILL",
                "TYPE",
                "pubsub",
              ]);
            } else if (killType === "TYPE NORMAL") {
              result = await client.sendCommand([
                "CLIENT",
                "KILL",
                "TYPE",
                "normal",
              ]);
            } else if (killType === "LIST") {
              result = await client.sendCommand(["CLIENT", "LIST"]);
            } else {
              throw new Error(
                "Invalid CLIENT KILL type. Use 'TYPE PUBSUB' or 'TYPE NORMAL'"
              );
            }
          } else if (key === "LIST") {
            result = await client.sendCommand(["CLIENT", "LIST"]);
          } else {
            throw new Error("Invalid CLIENT command. Use 'KILL' or 'LIST'");
          }
        } else {
          throw new Error("Invalid command parameters");
        }
        break;

      case "getKeyInfo":
        if (!key) throw new Error("Key is required");
        const type = await client.type(key);
        const ttl = await client.ttl(key);
        const size = await client.memoryUsage(key);

        result = {
          type,
          ttl: ttl === -1 ? "No expiration" : `${ttl} seconds`,
          size: formatBytes(size || 0),
        };
        break;

      default:
        throw new Error("Invalid action");
    }

    await client.disconnect();

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Redis command error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper functions
function parseRedisInfo(info: string): Record<string, any> {
  const lines = info.split("\r\n");
  const result: Record<string, any> = {};

  for (const line of lines) {
    if (line.includes(":")) {
      const [key, value] = line.split(":");
      result[key] = value;
    }
  }

  return result;
}

async function getKeyTypes(
  client: any,
  keys: string[]
): Promise<Record<string, number>> {
  const types: Record<string, number> = {};

  for (const key of keys) {
    try {
      const type = await client.type(key);
      types[type] = (types[type] || 0) + 1;
    } catch (error) {
      // Key might have been deleted
    }
  }

  return types;
}

async function measureLatency(client: any): Promise<number> {
  const start = Date.now();
  await client.ping();
  return Date.now() - start;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
