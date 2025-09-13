import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const INDEXNOW_API_URL = 'https://api.indexnow.org/indexnow';

export async function POST(request: NextRequest) {
  try {
    if (!INDEXNOW_KEY) {
      return NextResponse.json(
        { error: 'IndexNow key not configured' },
        { status: 500 }
      );
    }

    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Invalid URLs provided' },
        { status: 400 }
      );
    }

    const host = new URL(request.url).hostname;
    const keyLocation = `https://${host}/${INDEXNOW_KEY}.txt`;

    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation,
      urlList: urls,
    };

    const response = await fetch(INDEXNOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('IndexNow submission error:', response.status, errorText);

      let errorMessage = 'Failed to submit URLs to IndexNow';
      switch (response.status) {
        case 400:
          errorMessage = 'Invalid request format';
          break;
        case 403:
          errorMessage = 'Invalid IndexNow key';
          break;
        case 422:
          errorMessage = 'URLs do not match the host';
          break;
        case 429:
          errorMessage = 'Too many requests - please try again later';
          break;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully submitted ${urls.length} URL(s) to IndexNow`,
      urls,
    });
  } catch (error) {
    console.error('IndexNow submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!INDEXNOW_KEY) {
    return NextResponse.json(
      { error: 'IndexNow not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    configured: true,
    keyFile: `/${INDEXNOW_KEY}.txt`,
  });
}