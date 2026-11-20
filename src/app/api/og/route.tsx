import { ImageResponse } from "next/og";

export const alt = "Infimum Consulting — technology that moves business forward";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1221",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-120px",
            top: "-160px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            border: "1px solid rgba(147,197,253,0.16)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            border: "1px solid rgba(34,211,238,0.12)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "1px",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#06b6d4",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "17px",
                letterSpacing: "4px",
                color: "#93a4bd",
                fontWeight: 600,
              }}
            >
              INFIMUM CONSULTING
            </span>
          </div>
          <span
            style={{
              fontSize: "13px",
              letterSpacing: "3px",
              color: "#64748b",
            }}
          >
            IT CONSULTING · AU / US
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "15px",
              letterSpacing: "4px",
              color: "#22d3ee",
              fontWeight: 600,
            }}
          >
            TECHNOLOGY CONSULTING
          </span>
          <span
            style={{
              marginTop: "20px",
              fontSize: "68px",
              lineHeight: 1.06,
              letterSpacing: "-2.5px",
              color: "#ffffff",
              fontWeight: 700,
              maxWidth: "920px",
            }}
          >
            Technology that moves business forward.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "24px",
            fontSize: "16px",
            color: "#8b9cb5",
          }}
        >
          <span>Custom software · Cloud · Microsoft 365</span>
          <span>infimumconsulting.com.au</span>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
