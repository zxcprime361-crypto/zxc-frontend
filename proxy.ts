// import { NextRequest, NextResponse } from "next/server";

// const blockedIPs = ["45.86.86.43", "103.152.4.10", "172.56.252.226"];
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://192.168.1.4:3000",
//   "https://www.zxcprime.icu",
//   "https://zxcprime.icu",
//   "https://www.zxcprime.site",
//   "https://zxcprime.site",
// ];

// export async function proxy(req: NextRequest) {
//   const origin = req.headers.get("origin") || "";
//   const forwardedFor = req.headers.get("x-forwarded-for");
//   const ip = forwardedFor?.split(",")[0]?.trim() || "Unknown";
//   const ua = req.headers.get("user-agent") || "unknown";
//   console.log("middleware hit", { ip, ua, origin });
//   // 1️⃣ Block IPs
//   if (blockedIPs.includes(ip)) {
//     console.log("Blocked IP tried to access:", ip, ua);
//     return new NextResponse("Forbidden", { status: 403 });
//   }

//   // 2️⃣ Validate origin
//   const allowed =
//     origin === "" || allowedOrigins.some((url) => origin.includes(url));

//   if (!allowed) {
//     return new NextResponse("Forbidden", { status: 403 });
//   }

//   // ✅ Allow request to continue
//   return NextResponse.next();
// }
import { NextRequest, NextResponse } from "next/server";

const blockedIPs = ["45.86.86.43", "103.152.4.10", "172.56.252.226"];
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.4:3000",
  "https://www.zxcprime.icu",
  "https://zxcprime.icu",
  "https://www.zxcprime.site",
  "https://zxcprime.site",
];

// In-memory store for rate limiting
const rateLimitStore: Record<string, { count: number; lastRequest: number }> =
  {};
const MAX_REQUESTS = 10; // max requests per window
const WINDOW_MS = 1000; // 1 second window

export async function proxy(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "Unknown";
  const ua = req.headers.get("user-agent") || "unknown";

  console.log("Middleware hit", { ip, ua, origin });

  // 1️⃣ Block IPs
  if (blockedIPs.includes(ip)) {
    console.log(`Blocked IP tried to access: ${ip} ${ua}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2️⃣ Validate origin
  const allowed =
    origin === "" || allowedOrigins.some((url) => origin.includes(url));
  if (!allowed) {
    console.log(`Origin not allowed: ${origin} from IP: ${ip}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3️⃣ Rate limiting
  const now = Date.now();
  const record = rateLimitStore[ip] || { count: 0, lastRequest: now };

  if (now - record.lastRequest > WINDOW_MS) {
    // Reset window
    record.count = 1;
    record.lastRequest = now;
    console.log(`IP ${ip} request count reset.`);
  } else {
    record.count += 1;
    console.log(`IP ${ip} made request #${record.count} in current window.`);
  }

  rateLimitStore[ip] = record;

  if (record.count > MAX_REQUESTS) {
    console.log(`IP ${ip} detected: too many requests (${record.count})`);
    return new NextResponse("Too many requests", { status: 429 });
  }

  // ✅ Allow request to continue
  return NextResponse.next();
}
