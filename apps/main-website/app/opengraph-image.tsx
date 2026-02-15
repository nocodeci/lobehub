import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Wozif — Solutions numériques intelligentes pour l'Afrique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                {/* Grid pattern */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.05,
                        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "24px",
                        padding: "40px",
                    }}
                >
                    {/* Brand */}
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            color: "#ffffff",
                            letterSpacing: "-2px",
                        }}
                    >
                        Wozif
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: 28,
                            color: "rgba(255,255,255,0.6)",
                            textAlign: "center",
                            maxWidth: "800px",
                            lineHeight: 1.4,
                        }}
                    >
                        Solutions numériques intelligentes pour l&apos;Afrique
                    </div>

                    {/* Products */}
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            marginTop: "20px",
                        }}
                    >
                        <div
                            style={{
                                padding: "12px 28px",
                                borderRadius: "100px",
                                background: "rgba(255,122,0,0.15)",
                                color: "#FF7A00",
                                fontSize: 18,
                                fontWeight: 600,
                                border: "1px solid rgba(255,122,0,0.3)",
                            }}
                        >
                            Connect — WhatsApp IA
                        </div>
                        <div
                            style={{
                                padding: "12px 28px",
                                borderRadius: "100px",
                                background: "rgba(16,185,129,0.15)",
                                color: "#10B981",
                                fontSize: 18,
                                fontWeight: 600,
                                border: "1px solid rgba(16,185,129,0.3)",
                            }}
                        >
                            Gnata — Sites Web
                        </div>
                        <div
                            style={{
                                padding: "12px 28px",
                                borderRadius: "100px",
                                background: "rgba(59,130,246,0.15)",
                                color: "#3B82F6",
                                fontSize: 18,
                                fontWeight: 600,
                                border: "1px solid rgba(59,130,246,0.3)",
                            }}
                        >
                            AfriFlow — Paiements
                        </div>
                    </div>

                    {/* URL */}
                    <div
                        style={{
                            fontSize: 18,
                            color: "rgba(255,255,255,0.3)",
                            marginTop: "16px",
                        }}
                    >
                        wozif.com
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
