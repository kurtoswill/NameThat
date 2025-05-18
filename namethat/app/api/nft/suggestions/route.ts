import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/nft/suggestions?nft_id=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nftId = searchParams.get('nft_id');

  if (!nftId) {
    return NextResponse.json({ error: 'Missing nft_id' }, { status: 400 });
  }

  // Fetch the suggestions row for this nft_id
  const { data, error } = await supabase
    .from('suggestions')
    .select('id, suggestion_text, votes')
    .eq('nft_id', nftId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
  }

  // suggestion_text is an array of options
  const suggestions = Array.isArray(data.suggestion_text)
    ? data.suggestion_text.map((text, idx) => ({
        id: `${data.id}-${idx}`,
        name: text,
        votes: data.votes || 0, // all options share the same votes field in this schema
      }))
    : [];

  return NextResponse.json({ suggestions });
}
