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
    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', wallet_address)
        .single();

    if (user) {
        // If username is provided and different, update it
        if (username && user.username !== username) {
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
        // User exists, return user
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
        return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ user: newUser });
}
