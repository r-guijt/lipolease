import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse("Missing password fields", { status: 400 });
    }

    // Fetch user from DB to verify old password
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: session.user.id }
    });

    if (!user || !user.hashedPassword) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify current password
    const isCorrectPassword = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );

    if (!isCorrectPassword) {
      return new NextResponse("Incorrect current password", { status: 400 });
    }

    // Hash and save new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: hashedNewPassword }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT Change Admin Password Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
