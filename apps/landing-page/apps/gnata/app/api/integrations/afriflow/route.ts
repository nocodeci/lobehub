import { NextResponse } from 'next/server';

const getApiUrl = () => process.env.AFRIFLOW_API_URL || 'http://localhost:3000/api';

export async function POST(req: Request) {
    try {
        const { amount, title, description, customerEmail, customerName } = await req.json();

        if (!amount || !title) {
            return NextResponse.json(
                { error: 'Amount and title are required' },
                { status: 400 }
            );
        }

        const apiUrl = getApiUrl();
        const secretKey = process.env.AFRIFLOW_SECRET_KEY;
        const appId = process.env.AFRIFLOW_APP_ID;

        const payload = {
            applicationId: appId,
            title: title,
            description: description || `Payment for ${title}`,
            amount: parseFloat(amount),
            currency: "XOF",
            type: "one_time",
            metadata: {
                customerName,
                customerEmail,
                source: "Gnata AI"
            }
        };

        // Call AfriFlow v1 API
        const response = await fetch(`${apiUrl}/v1/payment-links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secretKey}`
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("AfriFlow API Error (Create):", errorText);
            return NextResponse.json({ error: `AfriFlow Error: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            url: data.url,
            id: data.id
        });

    } catch (error) {
        console.error('Error creating payment link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const linkId = searchParams.get('id');

        if (!linkId) {
            return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
        }

        const apiUrl = getApiUrl();
        const secretKey = process.env.AFRIFLOW_SECRET_KEY;

        const response = await fetch(`${apiUrl}/v1/payment-links/${linkId}/check`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("AfriFlow API Error (Check):", errorText);
            return NextResponse.json({ error: "Failed to check status" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
