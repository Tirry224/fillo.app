import { ImageResponse } from "next/og";

export const alt = "Fillo";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#273452",
          color: "#f3aa32",
          fontSize: 140,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        Fillo
      </div>
    ),
    { ...size },
  );
}
