import { NextResponse } from "next/server";
import { getReadsForProperty } from "@/lib/mock";
import { ReadEventSchema } from "@/lib/schemas";
import { z } from "zod";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const reads = getReadsForProperty(key);
  return NextResponse.json(z.array(ReadEventSchema).parse(reads));
}
