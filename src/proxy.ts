import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with src/i18n/config.ts (Proxy should not import app modules).
const prefixed = ["de", "en", "tr", "fa", "ar"];
const defaultLocale = "de";

/**
 * German is served without a prefix: "/projects" is rewritten to "/de/projects".
 * Prefixed URLs ("/en/projects") pass through unchanged. No redirects based on the
 * browser language — every visitor and crawler gets the URL they asked for.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (prefixed.includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, metadata files and anything with a file extension.
  matcher: ["/((?!_next/|api/|sitemap.xml|robots.txt|.*\\.[a-zA-Z0-9]+$).*)"],
};
