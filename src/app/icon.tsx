import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            width: 332,
            height: 392,
            borderRadius: 44,
            background: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 34,
            padding: "48px 44px",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.28)",
          }}
        >
          {[0, 1, 2].map((index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: "7px solid #2563eb",
                }}
              />
              <div
                style={{
                  height: 12,
                  width: 180,
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
