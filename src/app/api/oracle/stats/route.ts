import { NextResponse } from "next/server";
import { getStats } from "@/lib/mock";
import { StatsSchema } from "@/lib/schemas";

export async function GET() {
  const stats = StatsSchema.parse(getStats());
  return NextResponse.json(stats);
}
