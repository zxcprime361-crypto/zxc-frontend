// import { NextRequest, NextResponse } from "next/server";

// const blockedIPs = [
//   "45.86.86.43",
//   "75.218.156.20",
//   "120.29.68.4",
//   "73.249.175.122",
// ];
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
//   // console.log("middleware hit", { ip, ua, origin });
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
const blockedUAs = [
  "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
];
export async function proxy(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "Unknown";
  const ua = req.headers.get("user-agent") || "unknown";

  console.log("middleware hit", { ip, ua, origin });

  // 1️⃣ Block IPs
  if (blockedIPs.includes(ip)) {
    console.log("Blocked IP tried to access:", ip, ua);
    return new NextResponse("Forbidden", { status: 403 });
  }
  // 2️⃣ Block suspicious User-Agents
  if (blockedUAs.some((blocked) => ua.includes(blocked))) {
    console.log("Blocked UA tried to access:", ua, ip);
    return new NextResponse("Forbidden", { status: 403 });
  }
  // 2️⃣ Validate origin
  const allowed =
    origin === "" || allowedOrigins.some((url) => origin.includes(url));
  if (!allowed) return new NextResponse("Forbidden", { status: 403 });

  const pathParts = req.nextUrl.pathname.split("/").filter(Boolean);

  // 3️⃣ Block numeric IDs for movie routes
  if (
    pathParts.length === 3 &&
    (pathParts[0] === "details" || pathParts[0] === "watch") &&
    pathParts[1] === "movie"
  ) {
    const id = pathParts[2];
    if (/^\d+$/.test(id)) {
      console.log("Blocked numeric movie ID", pathParts.join("/"), ip, ua);
      return new NextResponse("Blocked", { status: 400 });
    }
  }

  // 4️⃣ Block numeric IDs for TV routes
  // Includes /details/tv/<id> and /watch/tv/<id>/...
  if (
    (pathParts[0] === "details" && pathParts[1] === "tv" && pathParts[2]) ||
    (pathParts[0] === "watch" && pathParts[1] === "tv" && pathParts[2])
  ) {
    const id = pathParts[2];
    if (/^\d+$/.test(id)) {
      console.log("Blocked numeric TV ID", pathParts.join("/"), ip, ua);
      return new NextResponse("Blocked", { status: 400 });
    }
  }

  // ✅ Allow request to continue
  return NextResponse.next();
}
