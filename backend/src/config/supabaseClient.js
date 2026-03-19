import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables!');
}

// The Service Role Key allows the backend to bypass Row Level Security 
// to verify domains and manage users securely.
export const supabase = createClient(supabaseUrl, supabaseKey);