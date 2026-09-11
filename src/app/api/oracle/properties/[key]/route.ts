import { NextResponse } from "next/server";
import { getProperty } from "@/lib/mock";
import { PropertySchema } from "@/lib/schemas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const property = getProperty(key);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json(PropertySchema.parse(property));
}
