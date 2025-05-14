import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/nft/upload
// Body: { user_id: string, image_url: string, name: string, caption?: string, categories?: string[], submission_type?: string }
export async function POST(req: NextRequest) {
  const { user_id, image_url, name, caption, categories, submission_type } = await req.json();
  if (!user_id || !image_url || !name) {
    return NextResponse.json({ error: 'user_id, image_url, and name are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('nfts')
    .insert([
      {
        user_id,
        image_url,
        name,
        caption: caption || null,
        categories: categories || [],
        votes: 0,
        status: 'public',
        submission_type: submission_type || 'regular',
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ nft: data });
}
