import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/nft/explore or /api/nft/explore?id=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nftId = searchParams.get('id');

  if (nftId) {
    // Fetch a single NFT by id
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('id', nftId)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ nft: data });
  }

  // Fetch ALL NFTs
  const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ nfts: data });
}
