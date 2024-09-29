import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M25 4H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h4l4 4 4-4h6a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z" />
          <circle cx="12" cy="14" r="1" fill="currentColor" />
          <circle cx="16" cy="14" r="1" fill="currentColor" />
          <circle cx="20" cy="14" r="1" fill="currentColor" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
