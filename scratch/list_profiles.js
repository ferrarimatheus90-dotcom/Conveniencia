const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://ryizqbbjxjrxcortkshv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkProfiles() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.error('Erro:', error);
    } else {
        console.log('Profiles:', JSON.stringify(data, null, 2));
    }
}
checkProfiles();
