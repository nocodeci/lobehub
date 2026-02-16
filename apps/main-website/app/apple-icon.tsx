import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
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
                    background: "#0D0D0D",
                    borderRadius: "40px",
                }}
            >
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF9933" />
                            <stop offset="100%" stopColor="#FF5500" />
                        </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="12" height="80" rx="6" fill="url(#wg)" />
                    <rect x="12" y="30" width="12" height="50" rx="6" fill="url(#wg)" transform="rotate(-10, 18, 80)" />
                    <rect x="35" y="20" width="12" height="60" rx="6" fill="url(#wg)" />
                    <rect x="58" y="30" width="12" height="50" rx="6" fill="url(#wg)" transform="rotate(10, 64, 80)" />
                    <rect x="70" y="0" width="12" height="80" rx="6" fill="url(#wg)" />
                </svg>
            </div>
        ),
        { ...size }
    );
}
