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
    const { verificationStatus, applicationStatus } = body;

    if (!verificationStatus && !applicationStatus) {
      return new NextResponse("Missing update fields", { status: 400 });
    }

    const updateData: any = {};
    if (verificationStatus) updateData.verificationStatus = verificationStatus;
    if (applicationStatus) updateData.applicationStatus = applicationStatus;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PUT Verify Applicant Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
