import { NextRequest, NextResponse } from 'next/server';

// In-memory notification history (persists as long as the server runs)
// In production, you'd store this in a DB
interface NotificationEntry {
    id: string;
    event: string;
    details: string;
    sent: boolean;
    timestamp: string;
}

const notificationHistory: NotificationEntry[] = [];
let autoCheckEnabled = false;
let autoCheckInterval: NodeJS.Timeout | null = null;

export async function GET() {
    return NextResponse.json({
        success: true,
        autoCheckEnabled,
        history: notificationHistory.slice(0, 100),
        total: notificationHistory.length,
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { action } = body;

    if (action === 'toggle_auto') {
        autoCheckEnabled = !autoCheckEnabled;
        return NextResponse.json({ success: true, autoCheckEnabled });
    }

    if (action === 'add_entries') {
        const entries = body.entries as NotificationEntry[];
        if (entries?.length) {
            notificationHistory.unshift(...entries);
            // Keep max 500 entries
            if (notificationHistory.length > 500) {
                notificationHistory.length = 500;
            }
        }
        return NextResponse.json({ success: true, total: notificationHistory.length });
    }

    if (action === 'clear') {
        notificationHistory.length = 0;
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}
