import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const FetchUsername = ({ userId }: { userId: string }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('username')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                setUsername(data.username);
            } catch (error) {
                console.error('Error fetching username:', error);
                setUsername(null);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUsername();
    }, [userId]);

    if (loading) return <span className="animate-pulse">...</span>;
    return <span>{username || "Unknown uploader"}</span>;
};
