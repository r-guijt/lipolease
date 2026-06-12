import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      devicePrice, 
      duration, 
      monthlyPatients, 
      sessionPrice, 
      monthlyLease, 
      monthlyRevenue, 
      breakEvenPatients,
      consent 
    } = body;

    if (!email || !consent) {
      return NextResponse.json({ success: false, error: "Missing required fields (email, consent)" }, { status: 400 });
    }

    let savedLead = null;
    try {
      savedLead = await prisma.lead.create({
        data: {
          email,
          source: "SIMULATION",
          devicePrice: devicePrice ? parseFloat(devicePrice) : null,
          duration: duration ? parseInt(duration) : null,
          monthlyPatients: monthlyPatients ? parseInt(monthlyPatients) : null,
          sessionPrice: sessionPrice ? parseFloat(sessionPrice) : null,
          monthlyLease: monthlyLease ? parseFloat(monthlyLease) : null,
          monthlyRevenue: monthlyRevenue ? parseFloat(monthlyRevenue) : null,
          breakEvenPatients: breakEvenPatients ? parseInt(breakEvenPatients) : null,
          consent: !!consent,
        }
      });
      console.log("Simulation lead successfully saved to database:", savedLead.id);
    } catch (dbError) {
      console.warn("Database connection issue. Logging simulation lead locally instead:", {
        email, devicePrice, duration, monthlyPatients, sessionPrice, monthlyLease, monthlyRevenue, breakEvenPatients, source: "SIMULATION", consent
      }, dbError);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Simulation lead received successfully", 
      data: savedLead ? { id: savedLead.id } : null 
    }, { status: 200 });

  } catch (error) {
    console.error("Error in simulation lead route:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
