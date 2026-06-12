import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, country, consent } = body;

    if (!email || !consent) {
      return NextResponse.json({ success: false, error: "Missing required fields (email, consent)" }, { status: 400 });
    }

    let savedLead = null;
    try {
      savedLead = await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          country,
          source: "CONTACT",
          consent: !!consent,
        }
      });
      console.log("Contact lead successfully saved to database:", savedLead.id);
    } catch (dbError) {
      console.warn("Database connection issue. Logging contact lead locally instead:", {
        name, email, phone, country, source: "CONTACT", consent
      }, dbError);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Lead received successfully", 
      data: savedLead ? { id: savedLead.id } : null 
    }, { status: 200 });

  } catch (error) {
    console.error("Error in contact lead route:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
