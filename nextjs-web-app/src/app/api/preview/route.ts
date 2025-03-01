import { NextResponse } from 'next/server';
import { previewCode } from '@/services/codeInterpreter';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const sessionID = nanoid(); // Generate a unique session ID for each preview

    const previewUrl = await previewCode(code, sessionID);

    return NextResponse.json({ previewUrl });
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
