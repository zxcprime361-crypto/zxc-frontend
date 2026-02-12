import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET =
  process.env.API_SECRET ||
  "G9v!r7Xq2#kPz8&Lf5@bD3sW1^mT0yH4*eJ6uC8$QnVwR2+ZpF7!aL9xS3";

export async function POST(req: NextRequest) {
  const id = await req.json(); // directly the object
  const ts = Date.now();
  const data = JSON.stringify({ ...id, ts });

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex");

  const token = Buffer.from(data).toString("base64");

  return NextResponse.json({ token, signature });
}
