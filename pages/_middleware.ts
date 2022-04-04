import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Plz dont be a bot.", { status: 403 });
  }

  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.carrotSession) {
      return NextResponse.redirect(`${req.nextUrl.origin}/enter`);
    }
  }
}
