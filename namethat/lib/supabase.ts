import { createClient } from '@supabase/supabase-js'

interface ImportMetaEnv {
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

declare global {
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey)