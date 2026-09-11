import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const XYZ_HOSTS = new Set(["chatarv.xyz", "www.chatarv.xyz"]);
const CANONICAL_HOST = "chatarv.ai";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";

  if (XYZ_HOSTS.has(hostname)) {
    const url = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      `https://${CANONICAL_HOST}`,
    );
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)"],
};
