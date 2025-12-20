import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASSWORD = "skills";
const USERNAME = "MSS2025"; // arbitrary

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect the Skills Matrix route
  if (!pathname.startsWith("/skills-matrix")) {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme?.toLowerCase() === "basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf8"); // "user:pass"
      const [, pass] = decoded.split(":");
      if (pass === PASSWORD) return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="Skills Matrix"`,
    },
  });
}

export const config = {
  matcher: ["/skills-matrix/:path*"],
};
