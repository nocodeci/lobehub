import { NextRequest, NextResponse } from 'next/server';

const BRIDGE_URL = 'http://127.0.0.1:8080';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`${BRIDGE_URL}/api/qr?userId=${userId}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching QR from bridge:', error);
        return NextResponse.json({ success: false, message: 'Bridge not reachable' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, recipient, message, mediaPath, latitude, longitude, address, vcard } = body;

        if (!userId || !recipient || (!message && !mediaPath && !latitude && !vcard)) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        console.log('Forwarding payload to bridge:', JSON.stringify({
            userId,
            recipient,
            message,
            media_path: mediaPath,
            latitude,
            longitude,
            address,
            vcard
        }));

        const response = await fetch(`${BRIDGE_URL}/api/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                recipient,
                message,
                media_path: mediaPath,
                latitude,
                longitude,
                address,
                vcard
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`Bridge responded with ${response.status}: ${text}`);
            return NextResponse.json({ success: false, message: `Bridge error: ${response.status}`, details: text }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sending message via bridge:', error);
        // @ts-ignore
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
            // @ts-ignore
            if (error.cause) console.error('Error cause:', error.cause);
        }
        return NextResponse.json({ success: false, message: 'Bridge not reachable', error: String(error) }, { status: 500 });
    }
}
