import { NextRequest, NextResponse } from "next/server";

const allowedReferers = [
  "http://localhost:3000/",
  "https://www.zxcprime.icu/",
  "https://zxcprime.icu/",
  "https://www.zxcprime.site/",
  "https://zxcprime.site/",
];
export async function proxy(req: NextRequest) {
  const referer = req.headers.get("referer") || "";
  const origin = req.headers.get("origin") || "";

  const allowed = allowedReferers.some(
    (url) => referer.includes(url) || origin.includes(url),
  );

  const response = NextResponse.next();
  if (!allowed) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>403 – Forbidden</title>
  <style>
    :root {
      --bg: #000000;
      --panel: #0a0a0a;
      --border: #1f1f1f;
      --text: #ededed;
      --muted: #a1a1a1;
      --accent: #ffffff;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background: radial-gradient(ellipse at top, #111 0%, #000 60%);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, Helvetica, Arial;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px 36px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.02),
        0 20px 40px rgba(0,0,0,0.6);
    }

    .code {
      font-size: 64px;
      font-weight: 700;
      letter-spacing: -0.04em;
      margin: 0;
    }

    .title {
      margin: 8px 0 12px;
      font-size: 18px;
      font-weight: 500;
    }

    .desc {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .divider {
      height: 1px;
      background: var(--border);
      margin: 24px 0;
    }

    .hint {
      font-size: 12px;
      color: var(--muted);
      opacity: 0.8;
    }

    .logo {
      margin-bottom: 16px;
      opacity: 0.9;
      font-size: 13px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">zxcprime</div>
    <h1 class="code">403</h1>
    <div class="title">Access denied</div>
    <p class="desc">
      This request was blocked by the security policy.<br />
      Direct access is not allowed.
    </p>
    <div class="divider"></div>
    <div class="hint">
      If you believe this is a mistake, access the site through the official domain.
    </div>
  </div>
</body>
</html>`,
      {
        status: 403,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      },
    );
  }

  return response;
}
