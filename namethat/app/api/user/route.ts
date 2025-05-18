import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/user
// Body: { wallet_address: string, username?: string, avatar_url?: string }
export async function POST(req: NextRequest) {
    const { wallet_address, username, avatar_url } = await req.json();

    if (!wallet_address) {
        return NextResponse.json({ error: 'wallet_address is required' }, { status: 400 });
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', wallet_address)
        .single();

    if (userError && userError.code !== 'PGRST116') {
        // Unexpected error
        return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (user) {
        // If username is provided and different, update username and NFTs
        if (username && user.username !== username) {
            // Update username in users table
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({ username })
                .eq('wallet_address', wallet_address)
                .select()
                .single();

            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 500 });
            }


            return NextResponse.json({ user: updatedUser });
        }

        // User exists, no username change needed
        return NextResponse.json({ user });
    }

    // Create new user with created_at
    const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
            {
                wallet_address,
                username: username || null,
                avatar_url: avatar_url || null,
                earnings: 0,
                created_at: new Date().toISOString(),
            },
        ])
        .select()
        .single();

    if (insertError) {
        console.error('User insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ user: newUser });
}
