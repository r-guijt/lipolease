import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jurisdiction, devicePrice, monthlyPatients, sessionPrice } = body;

    // Simulate backend processing and saving to database
    // In a real implementation, we would use Prisma here to save the Simulation record.

    const LEASING_RATE = 0.0216; // approx 650/month for 30k
    const monthlyLease = devicePrice * LEASING_RATE;
    const monthlyRevenue = sessionPrice * monthlyPatients;
    const breakEvenPatients = monthlyLease / sessionPrice;

    const responsePayload = {
      success: true,
      data: {
        jurisdiction,
        monthlyLease,
        monthlyRevenue,
        breakEvenPatients: Math.ceil(breakEvenPatients),
        taxDeductions: jurisdiction === "FR" 
          ? { rentDeductible: monthlyLease } 
          : { rentDeductible: monthlyLease, basicInvestmentDeduction: devicePrice * 0.10 }
      }
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  }
}
