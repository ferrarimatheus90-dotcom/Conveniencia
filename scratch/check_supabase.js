const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ryizqbbjxjrxcortkshv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkBackup() {
  const { data, error } = await supabase
    .from('config_app')
    .select('updated_at, json_db')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Erro ao buscar dados do Supabase:', error);
    return;
  }

  console.log('Última atualização no Supabase:', data.updated_at);
  if (data.json_db && data.json_db.config) {
    console.log('Configurações no JSON:', JSON.stringify(data.json_db.config, null, 2));
  } else {
    console.log('Configurações não encontradas no JSON.');
  }
}

checkBackup();
