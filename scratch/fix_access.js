const { createClient } = require('@supabase/supabase-js');

// Configurações extraídas do seu projeto
const SUPABASE_URL = 'https://ryizqbbjxjrxcortkshv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGNvcnRrc2h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjM0OTczNCwiZXhwIjoyMDkxOTI1NzM0fQ.waPgZQeOawzDbPSSz3RipTWycfTn1BXZWr_RLKcM6mc';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetAccess() {
  console.log('--- INICIANDO REPARO DE ACESSO ---');
  
  // 1. Tentar listar usuários para ver se a chave SERVICE_ROLE funciona
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ ERRO CRÍTICO: A chave administrativa (service_role) é inválida ou expirou.');
    console.error('Detalhes:', listError.message);
    console.log('\n--- SOLUÇÃO ALTERNATIVA ---');
    console.log('Como a chave administrativa falhou, você precisará resetar a senha manualmente no painel do Supabase.');
    return;
  }

  console.log('✅ Chave administrativa validada. Usuários encontrados:', users.users.length);

  // 2. Procurar o usuário dev e admin
  for (const user of users.users) {
    if (user.email === 'ferrarimatheus90+dev@gmail.com') {
        console.log('🔄 Atualizando senha do DEV...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password: 'Dev@2026#' });
        if (updateError) console.error('❌ Erro ao atualizar DEV:', updateError.message);
        else console.log('✅ Senha do DEV atualizada com sucesso!');
    }
  }
  
  console.log('--- REPARO FINALIZADO ---');
}

resetAccess();
