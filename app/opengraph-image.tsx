import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Jossehallen – innendørs hundehall i Moelv";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 28,
              height: 120,
              backgroundColor: "#C2410C",
              borderRadius: 8,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 92,
                fontWeight: 800,
                letterSpacing: 2,
                color: "#111111",
              }}
            >
              JOSSEHALLEN
            </div>
            <div style={{ fontSize: 36, color: "#666666", marginTop: 8 }}>
              Innendørs hundehall i Moelv
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 56,
            fontSize: 30,
            color: "#C2410C",
            fontWeight: 600,
          }}
        >
          Kurs · Trening · Leie hall
        </div>
      </div>
    ),
    { ...size },
  );
}
