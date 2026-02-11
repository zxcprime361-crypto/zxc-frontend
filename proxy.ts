// import { NextRequest, NextResponse } from "next/server";

// const blockedIPs = ["45.86.86.43", "75.218.156.20", "120.29.68.4","73.249.175.122"];
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

// Blocked IPs
const blockedIPs = [
  "45.86.86.43",
  "75.218.156.20",
  "120.29.68.4",
  "73.249.175.122",
];

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.4:3000",
  "https://www.zxcprime.icu",
  "https://zxcprime.icu",
  "https://www.zxcprime.site",
  "https://zxcprime.site",
];

// Rate limit store
const rateLimitMap = new Map<
  string,
  { timestamps: number[] } // store request timestamps
>();

const RATE_LIMIT = 10; // max requests
const WINDOW_MS = 5000; // 5 seconds

export async function proxy(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const realIP = req.headers.get("x-real-ip") || "";
  const ip = forwardedFor.split(",")[0].trim() || realIP || "unknown";

  const ua = req.headers.get("user-agent") || "unknown";
  const origin = req.headers.get("origin") || "";

  const path = req.nextUrl.pathname;
  console.log("middleware hit", { ip, ua, origin, path });

  // 1️⃣ Block specific IPs
  if (blockedIPs.includes(ip)) {
    console.log("Blocked IP tried to access:", ip, ua);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2️⃣ Validate origin
  const allowed =
    origin === "" || allowedOrigins.some((url) => origin.includes(url));
  if (!allowed) {
    console.log("Blocked Origin:", origin);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3️⃣ Rate limit only for /details
  if (path.startsWith("/details")) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { timestamps: [] };

    // Remove old timestamps outside window
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

    // Add current request timestamp
    entry.timestamps.push(now);

    // Save back
    rateLimitMap.set(ip, entry);

    if (entry.timestamps.length > RATE_LIMIT) {
      console.log("Rate limit exceeded for IP:", ip, ua);
      return new NextResponse("Too many requests", { status: 429 });
    }
  }

  // ✅ Allow request
  return NextResponse.next();
}
