require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

let connectionString = process.env.DATABASE_URL;

if (connectionString && connectionString.startsWith("prisma+postgres://")) {
  const { URL } = require("url");
  const urlObj = new URL(connectionString);
  const apiKey = urlObj.searchParams.get("api_key");
  if (apiKey) {
    try {
      const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString("utf-8"));
      if (decoded.databaseUrl) {
        connectionString = decoded.databaseUrl;
      }
    } catch (e) {
      console.warn("⚠️ Failed to decode prisma+postgres api_key");
    }
  }
}

console.log("🔌 Initializing pg Pool and PrismaPg driver adapter...");
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Default Admin User
  const adminEmail = "admin@lipolease.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("adminpassword123", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        hashedPassword,
        role: "ADMIN",
        name: "Admin Administrator",
        jurisdiction: "FR"
      }
    });
    console.log("✅ Seeded admin user: admin@lipolease.com / adminpassword123");
  } else {
    console.log("ℹ️ Admin user already exists");
  }

  // 2. Seed Default Providers and Rates
  const providersData = [
    {
      name: "Grenke",
      isActive: true,
      rates: [
        { durationMonths: 24, apr: 0.045 },
        { durationMonths: 36, apr: 0.032 },
        { durationMonths: 48, apr: 0.025 },
        { durationMonths: 60, apr: 0.0216 }
      ]
    },
    {
      name: "DLL",
      isActive: true,
      rates: [
        { durationMonths: 24, apr: 0.046 },
        { durationMonths: 36, apr: 0.033 },
        { durationMonths: 48, apr: 0.026 },
        { durationMonths: 60, apr: 0.0220 }
      ]
    },
    {
      name: "BNP Paribas Leasing Solutions",
      isActive: true,
      rates: [
        { durationMonths: 24, apr: 0.044 },
        { durationMonths: 36, apr: 0.031 },
        { durationMonths: 48, apr: 0.024 },
        { durationMonths: 60, apr: 0.0210 }
      ]
    }
  ];

  for (const provider of providersData) {
    const upsertedProvider = await prisma.leaseProvider.upsert({
      where: { name: provider.name },
      update: { isActive: provider.isActive },
      create: { name: provider.name, isActive: provider.isActive }
    });

    console.log(`✅ Seeded provider: ${upsertedProvider.name}`);

    for (const rate of provider.rates) {
      await prisma.rate.upsert({
        where: {
          providerId_durationMonths: {
            providerId: upsertedProvider.id,
            durationMonths: rate.durationMonths
          }
        },
        update: { apr: rate.apr },
        create: {
          providerId: upsertedProvider.id,
          durationMonths: rate.durationMonths,
          apr: rate.apr
        }
      });
    }
    console.log(`   - Seeded rates for ${upsertedProvider.name}`);
  }

  // 3. Seed Default System Settings
  const defaultSettings = [
    { key: "be_default_national_price", value: "250" },
    { key: "be_default_brussels_price", value: "1000" },
    { key: "fr_default_price", value: "400" },
    { key: "be_tax_deduction_rate", value: "0.10" },
    { key: "fr_tax_deduction_rate", value: "1.00" },
    { key: "leasing_rate", value: "0.0216" }
  ];

  for (const setting of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: { key: setting.key, value: setting.value }
    });
    console.log(`✅ Seeded setting: ${setting.key} = ${setting.value}`);
  }

  console.log("🌿 Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    // Close the pg pool connection so the process terminates cleanly
    await pool.end();
  });
