import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let prismaClientInstance: PrismaClient | undefined;

export const getPrisma = (): PrismaClient => {
  if (!prismaClientInstance) {
    let connectionString = process.env.DATABASE_URL;

    // Decode local prisma+postgres HTTP dev connection string to direct TCP URL
    if (connectionString && connectionString.startsWith("prisma+postgres://")) {
      try {
        const urlObj = new URL(connectionString);
        const apiKey = urlObj.searchParams.get("api_key");
        if (apiKey) {
          const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString("utf-8"));
          if (decoded.databaseUrl) {
            connectionString = decoded.databaseUrl;
          }
        }
      } catch (e) {
        console.warn("Failed to decode local prisma+postgres api_key, using default connection string");
      }
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prismaClientInstance = new PrismaClient({ adapter });
  }
  return prismaClientInstance;
};

// Also export a proxy so existing imports like `prisma.user` work correctly
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getPrisma() as any)[prop];
  }
});
