import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (isActive === undefined) {
      return new NextResponse("Missing isActive state", { status: 400 });
    }

    const updatedProvider = await prisma.leaseProvider.update({
      where: { id },
      data: { isActive: Boolean(isActive) }
    });

    return NextResponse.json(updatedProvider);
  } catch (error: any) {
    console.error("PUT Toggle Provider Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
