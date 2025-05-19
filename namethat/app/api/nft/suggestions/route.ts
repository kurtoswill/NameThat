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
    // Always treat suggestion_text and votes as arrays
    const suggestionArr: string[] = Array.isArray(row.suggestion_text) ? row.suggestion_text : (row.suggestion_text ? [row.suggestion_text] : []);
    let votesArr: string[] = Array.isArray(row.votes) ? row.votes : (row.votes ? [row.votes] : []);
    // Fix: flatten any stringified arrays (e.g. '[0]')
    if (votesArr.length === 1 && typeof votesArr[0] === 'string' && votesArr[0].startsWith('[')) {
      try {
        const parsed = JSON.parse(votesArr[0]);
        if (Array.isArray(parsed)) votesArr = parsed.map(v => v.toString());
      } catch {}
    }
    // Ensure votesArr matches suggestionArr length
    if (votesArr.length < suggestionArr.length) {
      votesArr = [...votesArr, ...Array(suggestionArr.length - votesArr.length).fill('0')];
    } else if (votesArr.length > suggestionArr.length) {
      votesArr = votesArr.slice(0, suggestionArr.length);
    }
    return suggestionArr.map((option, idx) => ({
      id: `${row.id}-${idx}`,
      suggestion_text: option,
      votes: parseInt(votesArr[idx]) || 0,
      suggestion_row_id: row.id,
      option_index: idx,
    }));
  });

  return NextResponse.json({ suggestions });
}

// POST /api/nft/suggestions { nft_id, suggestion }
export async function POST(req: NextRequest) {
  const { nft_id, suggestion } = await req.json();
  if (!nft_id || !suggestion) {
    return NextResponse.json({ error: 'Missing nft_id or suggestion' }, { status: 400 });
  }

  // Try to find the open_suggestion row for this nft_id
  const { data: row, error: fetchError } = await supabase
    .from('suggestions')
    .select('id, suggestion_text, votes')
    .eq('nft_id', nft_id)
    .single();

  if (fetchError || !row) {
    // No row exists, create it
    const { error: insertError } = await supabase
      .from('suggestions')
      .insert([
        {
          nft_id,
          suggestion_text: [suggestion],
          votes: ["0"],
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, suggestion: suggestion });
  }

  // suggestion_text and votes are arrays
  let suggestionArr: string[] = Array.isArray(row.suggestion_text) ? [...row.suggestion_text] : (row.suggestion_text ? [row.suggestion_text] : []);
  // Fix: flatten any stringified arrays (e.g. '["Test"]')
  if (suggestionArr.length === 1 && typeof suggestionArr[0] === 'string' && suggestionArr[0].startsWith('[')) {
    try {
      const parsed = JSON.parse(suggestionArr[0]);
      if (Array.isArray(parsed)) suggestionArr = parsed.map(v => v.toString());
    } catch {}
  }
  let votesArr: string[] = Array.isArray(row.votes) ? [...row.votes] : (row.votes ? [row.votes] : []);
  // Fix: flatten any stringified arrays (e.g. '[0]')
  if (votesArr.length === 1 && typeof votesArr[0] === 'string' && votesArr[0].startsWith('[')) {
    try {
      const parsed = JSON.parse(votesArr[0]);
      if (Array.isArray(parsed)) votesArr = parsed.map(v => v.toString());
    } catch {}
  }
  suggestionArr.push(suggestion);
  votesArr.push("0");
  // Ensure votesArr matches suggestionArr length
  if (votesArr.length < suggestionArr.length) {
    votesArr = [...votesArr, ...Array(suggestionArr.length - votesArr.length).fill('0')];
  } else if (votesArr.length > suggestionArr.length) {
    votesArr = votesArr.slice(0, suggestionArr.length);
  }

  const { error: updateError } = await supabase
    .from('suggestions')
    .update({ suggestion_text: suggestionArr, votes: votesArr })
    .eq('id', row.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, suggestion: suggestion });
}

// PATCH /api/nft/suggestions { nft_id, user_id, suggestion_index }
export async function PATCH(req: NextRequest) {
  const { nft_id, user_id, suggestion_index } = await req.json();
  if (!nft_id || user_id == null || suggestion_index == null) {
    return NextResponse.json({ error: 'Missing nft_id, user_id, or suggestion_index' }, { status: 400 });
  }

  // Find the open_suggestion row for this nft_id
  const { data: row, error: fetchError } = await supabase
    .from('suggestions')
    .select('id, votes')
    .eq('nft_id', nft_id)
    .single();

  if (fetchError || !row) {
    return NextResponse.json({ error: fetchError?.message || 'Suggestion row not found' }, { status: 404 });
  }

  const votesArr: string[] = Array.isArray(row.votes) ? [...row.votes] : (row.votes ? [row.votes] : []);
  if (votesArr[suggestion_index] == null) {
    return NextResponse.json({ error: 'Invalid suggestion index' }, { status: 400 });
  }
  votesArr[suggestion_index] = ((parseInt(votesArr[suggestion_index]) || 0) + 1).toString();

  const { error: updateError } = await supabase
    .from('suggestions')
    .update({ votes: votesArr })
    .eq('id', row.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
