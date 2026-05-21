import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        }}
      >
        <div
          style={{
            width: 120,
            height: 142,
            borderRadius: 16,
            background: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 12,
            padding: "16px 14px",
          }}
        >
          {[0, 1, 2].map((index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  border: "3px solid #2563eb",
                }}
              />
              <div
                style={{
                  height: 5,
                  width: 68,
                  borderRadius: 999,
                  background: "#2563eb",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
