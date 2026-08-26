import { ImageResponse } from "next/og";

export const alt = "Reko — 재테크 계산기 & 금융 정보";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            background: "#18181b",
          }}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" />
            <path d="M16 10h.01" />
            <path d="M2 8v1a2 2 0 0 0 2 2h1" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 80,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          Reko
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 32,
            color: "#a1a1aa",
          }}
        >
          연봉 · 대출 · 퇴직금 계산을 한 곳에서
        </div>
      </div>
    ),
    { ...size }
  );
}
