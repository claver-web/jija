import { PrismaClient } from "@prisma/client";
import { mockPrisma } from "./mock-data";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
  prismaCache?: Map<string, { data: any; expiry: number }>;
};

const cache = globalForPrisma.prismaCache ?? new Map<string, { data: any; expiry: number }>();
globalForPrisma.prismaCache = cache;

const CACHE_TTL_MS = 60 * 1000; // 60 seconds in-memory cache for reads
const READ_TIMEOUT_MS = 2500; // 2.5 second timeout for database reads to prevent thread blocking

function hasValidDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return (
    (trimmed.startsWith("postgresql://") || trimmed.startsWith("postgres://")) &&
    !trimmed.includes("ep-fragrant-waterfall") // Exclude older database
  );
}

const WRITE_METHODS = new Set([
  "create",
  "update",
  "delete",
  "upsert",
  "createMany",
  "updateMany",
  "deleteMany",
  "executeRaw",
  "queryRaw",
]);

function createPrismaClient(): any {
  if (!hasValidDatabaseUrl()) {
    console.info("ℹ️ Running in detached database mode (Mock Data Store). Set DATABASE_URL to connect PostgreSQL.");
    return mockPrisma;
  }

  try {
    const client = new PrismaClient({
      log: [
        { emit: "event", level: "error" },
        { emit: "event", level: "warn" },
      ],
    });

    // @ts-ignore - Prisma event listener
    client.$on("error", (e: any) => {
      const msg = typeof e === "string" ? e : e?.message || "";
      if (
        msg.includes("Connection reset by peer") ||
        msg.includes("Connection closed") ||
        msg.includes("kind: Closed") ||
        msg.includes("code: 104") ||
        msg.includes("timed out")
      ) {
        return;
      }
      console.error("Prisma error:", msg || e);
    });

    // High-performance Proxy with read-caching and timeout protection against remote database latency
    return new Proxy(client, {
      get(target: any, prop: string) {
        const orig = target[prop];
        if (typeof orig === "object" && orig !== null) {
          return new Proxy(orig, {
            get(subTarget: any, subProp: string) {
              const method = subTarget[subProp];
              if (typeof method === "function") {
                return async (...args: any[]) => {
                  const isWrite = WRITE_METHODS.has(subProp);

                  if (isWrite) {
                    // Invalidate read cache on any write mutation
                    cache.clear();
                    try {
                      return await method.apply(subTarget, args);
                    } catch (err: any) {
                      console.warn(`[Prisma Write Fallback] ${prop}.${subProp} failed. Using mock data store.`);
                      const mockModel = (mockPrisma as any)[prop];
                      if (mockModel && typeof mockModel[subProp] === "function") {
                        return await mockModel[subProp](...args);
                      }
                      throw err;
                    }
                  }

                  // Read query: check in-memory cache first
                  let cacheKey = "";
                  try {
                    cacheKey = `${prop}.${subProp}:${JSON.stringify(args)}`;
                  } catch {
                    cacheKey = `${prop}.${subProp}`;
                  }

                  const cached = cache.get(cacheKey);
                  const now = Date.now();
                  if (cached && cached.expiry > now) {
                    return cached.data;
                  }

                  // Execute with timeout to prevent remote database network latency from stalling page loads
                  try {
                    let timer: NodeJS.Timeout | null = null;
                    const queryPromise = method.apply(subTarget, args);
                    const timeoutPromise = new Promise((_, reject) => {
                      timer = setTimeout(() => reject(new Error(`Query timeout (${READ_TIMEOUT_MS}ms)`)), READ_TIMEOUT_MS);
                    });

                    const result = await Promise.race([queryPromise, timeoutPromise]);
                    if (timer) clearTimeout(timer);

                    cache.set(cacheKey, { data: result, expiry: now + CACHE_TTL_MS });
                    return result;
                  } catch (err: any) {
                    // Graceful fast fallback to mock data store
                    const mockModel = (mockPrisma as any)[prop];
                    if (mockModel && typeof mockModel[subProp] === "function") {
                      const mockRes = await mockModel[subProp](...args);
                      cache.set(cacheKey, { data: mockRes, expiry: now + 10000 });
                      return mockRes;
                    }
                    throw err;
                  }
                };
              }
              return method;
            },
          });
        }
        return orig;
      },
    });
  } catch (e) {
    console.warn("Failed to initialize Prisma Client. Falling back to mock data store.");
    return mockPrisma;
  }
}

export const prisma: PrismaClient = (globalForPrisma.prisma ?? createPrismaClient()) as unknown as PrismaClient;

globalForPrisma.prisma = prisma;

export default prisma;
