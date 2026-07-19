import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#4f46e5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8c0-4-3-6-5-6s-5 2-5 6c0 5 3 8 5 10 2-2 5-5 5-10z"/>
          <path d="M12 2v20"/>
        </svg>
      </div>
    ),
    { ...size }
  );
}
