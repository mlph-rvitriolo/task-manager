import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 