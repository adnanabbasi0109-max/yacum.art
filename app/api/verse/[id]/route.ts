import { NextRequest, NextResponse } from 'next/server';
import { verses } from '@/data/verses';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const verse = verses.find((v) => v.id === id);

    if (!verse) {
      return NextResponse.json(
        { error: 'Verse not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(verse);
  } catch (error) {
    console.error('Error fetching verse:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verse' },
      { status: 500 }
    );
  }
}
