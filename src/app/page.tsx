import React from "react";
import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

export type Language = "FR" | "NL";

export default async function Home() {
  // Query all system settings from the database on the server side
  const settingsList = await prisma.systemSetting.findMany();
  const settings = settingsList.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  // Query active providers and their rates
  const providers = await prisma.leaseProvider.findMany({
    where: { isActive: true },
    include: {
      rates: {
        orderBy: { durationMonths: "asc" }
      }
    },
    orderBy: { name: "asc" }
  });

  const serializedProviders = JSON.parse(JSON.stringify(providers));

  return <HomeClient initialSettings={settings} initialProviders={serializedProviders} />;
}
