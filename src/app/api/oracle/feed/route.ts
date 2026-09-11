import { NextRequest, NextResponse } from "next/server";
import { getFeed } from "@/lib/mock";
import { FeedEntrySchema } from "@/lib/schemas";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 10;
  const feed = getFeed(Number.isFinite(limit) ? limit : 10);
  return NextResponse.json(z.array(FeedEntrySchema).parse(feed));
}
