import { NextRequest, NextResponse } from "next/server";

const blockedIPs = [
  "45.86.86.43",
  "75.218.156.20",
  "120.29.68.4",
  "73.249.175.122",
];
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.4:3000",
  "https://www.zxcprime.icu",
  "https://zxcprime.icu",
  "https://www.zxcprime.site",
  "https://zxcprime.site",
];

export async function proxy(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "Unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  // console.log("middleware hit", { ip, ua, origin });
  // 1️⃣ Block IPs
  if (blockedIPs.includes(ip)) {
    console.log("Blocked IP tried to access:", ip, ua);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2️⃣ Validate origin
  const allowed =
    origin === "" || allowedOrigins.some((url) => origin.includes(url));

  if (!allowed) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ✅ Allow request to continue
  return NextResponse.next();
}
