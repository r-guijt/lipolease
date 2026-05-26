import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, jurisdiction, professionalId, name } = body;

    if (!email || !password || !role || !jurisdiction) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return new NextResponse("Email already registered", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role,
        jurisdiction,
        professionalId,
        name: name || "",
      }
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      jurisdiction: user.jurisdiction
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
