import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/nft/explore
export async function GET() {
  // Fetch ALL NFTs, no status filter, always in sync with database
  const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ nfts: data });
}
