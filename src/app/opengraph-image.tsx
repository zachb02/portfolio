import { ImageResponse } from "next/og";
import { profile } from "@/lib/resume-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0b",
          color: "#f4f4f5",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            color: "#00e5ff",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {profile.availability}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          <span>Building software</span>
          <span style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span>and the</span>
            <span style={{ color: "#00e5ff" }}>agents</span>
            <span>that ship it.</span>
          </span>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 28, color: "#a1a1aa" }}>
          {profile.name} - {profile.role}
        </div>
      </div>
    ),
    { ...size }
  );
}
