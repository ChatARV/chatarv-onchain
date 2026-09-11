import { NextRequest, NextResponse } from "next/server";
import { listProperties } from "@/lib/mock";
import { PropertySummarySchema } from "@/lib/schemas";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? undefined;
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  const results = listProperties(q);
  const page =
    typeof limit === "number" && Number.isFinite(limit) ? results.slice(0, limit) : results;

  return NextResponse.json(z.array(PropertySummarySchema).parse(page));
}
