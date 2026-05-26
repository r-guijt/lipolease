import { PrismaClient } from "@prisma/client";

let prismaClientInstance: PrismaClient | undefined;

export const getPrisma = (): PrismaClient => {
  if (!prismaClientInstance) {
    prismaClientInstance = new PrismaClient();
  }
  return prismaClientInstance;
};

// Also export a proxy so existing imports like `prisma.user` work correctly
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getPrisma() as any)[prop];
  }
});
