import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/nft/suggestions?nft_id=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nftId = searchParams.get('nft_id');

  if (!nftId) {
    return NextResponse.json({ error: 'Missing nft_id' }, { status: 400 });
  }

  // Fetch all suggestions rows for this nft_id
  const { data, error } = await supabase
    .from('suggestions')
    .select('id, suggestion_text, votes')
    .eq('nft_id', nftId);

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
  }

  // Each row is a suggestion
  const suggestions = data.flatMap(row => {
    if (Array.isArray(row.suggestion_text)) {
      return row.suggestion_text.map((option, idx) => ({
        id: `${row.id}-${idx}`,
        suggestion_text: option,
        votes: Array.isArray(row.votes) ? (parseInt(row.votes[idx]) || 0) : 0,
        suggestion_row_id: row.id,
        option_index: idx,
      }));
    } else {
      return [{
        id: row.id,
        suggestion_text: row.suggestion_text,
        votes: Array.isArray(row.votes) ? (parseInt(row.votes[0]) || 0) : (row.votes || 0),
        suggestion_row_id: row.id,
        option_index: 0,
      }];
    }
  });

  return NextResponse.json({ suggestions });
}

// POST /api/nft/suggestions { nft_id, suggestion }
export async function POST(req: NextRequest) {
  const { nft_id, suggestion } = await req.json();
  if (!nft_id || !suggestion) {
    return NextResponse.json({ error: 'Missing nft_id or suggestion' }, { status: 400 });
  }

  // Insert a new suggestion row for open_suggestion mode
  // suggestion_text is a string, votes is an array with one 0
  const { data, error } = await supabase
    .from('suggestions')
    .insert([
      {
        nft_id,
        suggestion_text: suggestion,
        votes: [0],
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, suggestion: data });
}

// PATCH /api/nft/suggestions { nft_id, suggestion_id }
export async function PATCH(req: NextRequest) {
  const { nft_id, suggestion_id } = await req.json();
  if (!nft_id || !suggestion_id) {
    return NextResponse.json({ error: 'Missing nft_id or suggestion_id' }, { status: 400 });
  }

  // Fetch the suggestion row
  const { data, error } = await supabase
    .from('suggestions')
    .select('id, votes')
    .eq('id', suggestion_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Suggestion not found' }, { status: 404 });
  }

  // Increment the first entry in the votes array (for single-option suggestions)
  const votesArr = Array.isArray(data.votes) ? [...data.votes] : [0];
  votesArr[0] = (parseInt(votesArr[0]) || 0) + 1;

  const { error: updateError } = await supabase
    .from('suggestions')
    .update({ votes: votesArr })
    .eq('id', suggestion_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
