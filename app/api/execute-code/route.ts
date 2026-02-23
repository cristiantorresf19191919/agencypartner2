import { NextRequest, NextResponse } from "next/server";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";
const PISTON_API_KEY = process.env.PISTON_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (PISTON_API_KEY) {
      headers["Authorization"] = PISTON_API_KEY;
    }

    const res = await fetch(PISTON_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || `Piston API error: ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Code execution failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
