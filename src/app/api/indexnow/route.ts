import { NextRequest, NextResponse } from 'next/server';

const API_KEY = '4090819601ab3b122e621940fc95ed41';
const HOST = 'uscartel.com';

export async function POST(request: NextRequest) {
    try {
        const { urls } = await request.json();

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: 'URLs array is required' },
                { status: 400 }
            );
        }

        // Validate URLs
        const validUrls = urls.filter(url => {
            try {
                const urlObj = new URL(url);
                return urlObj.hostname === HOST || urlObj.hostname === `www.${HOST}`;
            } catch {
                return false;
            }
        });

        if (validUrls.length === 0) {
            return NextResponse.json(
                { error: 'No valid URLs provided' },
                { status: 400 }
            );
        }

        // Submit to IndexNow (supports Bing, Yandex, and other search engines)
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                host: HOST,
                key: API_KEY,
                keyLocation: `https://${HOST}/${API_KEY}.txt`,
                urlList: validUrls,
            }),
        });

        // IndexNow returns 200 or 202 on success
        if (response.ok || response.status === 202) {
            return NextResponse.json({
                success: true,
                message: 'URLs submitted to IndexNow successfully',
                submittedUrls: validUrls,
                count: validUrls.length,
            });
        } else {
            const errorText = await response.text();
            console.error('IndexNow submission failed:', errorText);
            return NextResponse.json(
                {
                    error: 'Failed to submit to IndexNow',
                    details: errorText,
                    status: response.status
                },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('IndexNow API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

// Optional: GET endpoint to check IndexNow status
export async function GET() {
    return NextResponse.json({
        indexNow: {
            enabled: true,
            host: HOST,
            keyLocation: `https://${HOST}/${API_KEY}.txt`,
            endpoint: '/api/indexnow',
            usage: 'POST with JSON body: { "urls": ["https://uscartel.com/products/slug"] }',
        },
    });
}