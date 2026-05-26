import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return <DashboardClient />;
}
