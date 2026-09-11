import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePreview } from "@/lib/mock";
import { PublishPreviewSchema } from "@/lib/schemas";

const BodySchema = z.object({
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(3),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = BodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const { address, city, state, zip } = parsed.data;
  const preview = generatePreview(address, city, state, zip);
  return NextResponse.json(PublishPreviewSchema.parse(preview));
}
