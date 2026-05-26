import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Fetch system settings
    const settingsList = await prisma.systemSetting.findMany();
    const settings = settingsList.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    // 2. Fetch providers with their rates
    const providers = await prisma.leaseProvider.findMany({
      include: {
        rates: {
          orderBy: {
            durationMonths: "asc"
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json({ settings, providers });
  } catch (error: any) {
    console.error("GET Settings Rates Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { settings, rates } = body;

    // 1. Update settings
    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        await prisma.systemSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        });
      }
    }

    // 2. Update rates
    if (rates && Array.isArray(rates)) {
      for (const rate of rates) {
        await prisma.rate.update({
          where: { id: rate.id },
          data: { apr: parseFloat(rate.apr) }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT Settings Rates Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
