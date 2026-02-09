import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Connect by Wozif - Automatisation WhatsApp avec IA';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #075e54 0%, #128C7E 50%, #25D366 100%)',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Logo and Brand */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 30,
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 30,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        }}
                    >
                        <svg width="70" height="70" viewBox="0 0 24 24" fill="#075e54">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.12-1.32C8.52 21.52 10.22 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.46 13.12l-.74 2.14c-.09.25-.35.41-.62.38-.35-.04-3.45-.45-5.07-1.97-1.67-1.57-2.12-4.81-2.16-5.16-.03-.27.13-.52.38-.62l2.14-.74c.28-.1.59.02.74.28l.85 1.54c.12.22.08.5-.09.67l-.73.73c.29.66.76 1.29 1.38 1.84.62.54 1.29.93 2 1.16l.73-.73c.17-.17.45-.21.67-.09l1.54.85c.26.15.38.46.28.74z" />
                        </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                            style={{
                                fontSize: 72,
                                fontWeight: 900,
                                color: 'white',
                                letterSpacing: -2,
                                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            }}
                        >
                            Connect
                        </span>
                        <span
                            style={{
                                fontSize: 24,
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 500,
                            }}
                        >
                            by Wozif
                        </span>
                    </div>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: 36,
                        color: 'white',
                        textAlign: 'center',
                        maxWidth: 900,
                        lineHeight: 1.4,
                        fontWeight: 600,
                        marginBottom: 50,
                    }}
                >
                    Automatisation WhatsApp avec Intelligence Artificielle
                </div>

                {/* Features Pills */}
                <div
                    style={{
                        display: 'flex',
                        gap: 20,
                    }}
                >
                    {['Agents IA', 'Chatbots', 'CRM', 'Multi-comptes'].map((feature) => (
                        <div
                            key={feature}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: 50,
                                padding: '12px 28px',
                                fontSize: 22,
                                color: 'white',
                                fontWeight: 600,
                                border: '1px solid rgba(255,255,255,0.3)',
                            }}
                        >
                            {feature}
                        </div>
                    ))}
                </div>

                {/* Bottom URL */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        fontSize: 24,
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500,
                    }}
                >
                    connect.wozif.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
