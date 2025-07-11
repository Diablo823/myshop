import { NextResponse, NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const tag = request.nextUrl.searchParams.get('tag');

    // Verify the secret
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!tag) {
        return NextResponse.json({ message: 'Tag is required' }, { status: 400 });
    }

    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, now: Date.now(), tag: tag })
}