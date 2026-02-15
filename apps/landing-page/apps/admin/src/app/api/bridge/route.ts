import { NextRequest, NextResponse } from 'next/server';

const BRIDGE_URL = 'http://127.0.0.1:8080';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Special case to list sessions
    if (req.url.endsWith('/sessions') || userId === 'sessions') {
        try {
            const response = await fetch(`${BRIDGE_URL}/api/sessions`);
            const data = await response.json();
            return NextResponse.json(data);
        } catch (error) {
            console.error('Error fetching sessions from bridge proxy:', error);
            return NextResponse.json({ success: false, message: 'Bridge not reachable' }, { status: 500 });
        }
    }

    if (!userId) {
        return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`${BRIDGE_URL}/api/qr?userId=${userId}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching QR from bridge proxy:', error);
        return NextResponse.json({ success: false, message: 'Bridge not reachable' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`${BRIDGE_URL}/api/sessions?userId=${userId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error deleting session via proxy:', error);
        return NextResponse.json({ success: false, message: 'Bridge not reachable' }, { status: 500 });
    }
}
