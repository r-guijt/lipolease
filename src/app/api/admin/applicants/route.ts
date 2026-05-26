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

    const applicants = await prisma.user.findMany({
      where: {
        role: {
          not: "ADMIN"
        }
      },
      include: {
        documents: {
          orderBy: {
            uploadedAt: "desc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(applicants);
  } catch (error: any) {
    console.error("GET Applicants Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
