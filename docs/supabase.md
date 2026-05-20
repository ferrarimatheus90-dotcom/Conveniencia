# Integração com Supabase (Persistência Principal na Nuvem)

Este documento detalha o papel da infraestrutura do Supabase na centralização de dados, autenticação de usuários e telemetria do sistema.

---

## 1. Modelo de Persistência Single-Column JSON

Ao contrário do modelo relacional convencional de banco de dados onde cada coleção (produtos, vendas, etc.) vira uma tabela física, este sistema utiliza uma abordagem de alto desempenho e extrema flexibilidade chamada **Single-Column JSON**.

Toda a base de dados do cliente é serializada em uma string estruturada e gravada em uma única coluna do tipo `jsonb` em uma tabela de configuração no Supabase.

### Estrutura de Tabelas no Supabase:

#### Tabela: `config_app`
Esta tabela possui apenas uma linha de controle contendo o backup global de dados da aplicação.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `int8` (Primary Key) | Sempre igual a `1` (Garante que só haja uma linha de dados unificada) |
| `json_db` | `jsonb` | Payload completo serializado com as coleções `produtos`, `vendas`, `compras` e `auditoria` |
| `updated_at` | `timestamptz` | Carimbo de data/hora da última atualização para verificação de concorrência |

---

## 2. Autenticação e Gestão de Sessões

O sistema utiliza o **Supabase Auth** para realizar a validação segura de credenciais através do método `signInWithPassword`.

### Fluxo de Login e Níveis de Acesso:
1. O usuário digita o e-mail/usuário e a senha.
2. A requisição é enviada para a API do Supabase Auth.
3. Em caso de sucesso, o Supabase retorna os metadados do usuário (`user_metadata`).
4. **Resolução de Papéis (Roles):**
   - Se o e-mail do usuário contém a string `"dev"` (ex: `ferrarimatheus90+dev@gmail.com`), ele é autenticado como **Desenvolvedor** (`role: 'dev'`).
   - Se o e-mail contém `"admin"`, ele é autenticado como **Administrador** (`role: 'admin'`).
   - Caso contrário, assume o papel padrão de **Funcionário** (`role: 'funcionario'`).
5. A sessão ativa é persistida automaticamente. No próximo carregamento do site, o sistema verifica a sessão existente com `sb.auth.getSession()` para evitar novos logins desnecessários.

---

## 3. Sincronização em Segundo Plano (Background Sync)

Para garantir que múltiplos dispositivos rodando o sistema ao mesmo tempo vejam as mesmas informações quase em tempo real, o arquivo `js/app.js` mantém uma rotina ativa:

```javascript
window.bgSyncInterval = setInterval(async () => {
  const hasUpdates = await loadDBFromCloud();
  if (hasUpdates) {
    // Re-renderiza a tela atual se novos dados chegarem
    triggerScreenRefresh();
  }
}, 30000); // Executa a cada 30 segundos
```

---

## 4. Ferramentas do Desenvolvedor (Painel DEV)

Para monitorar e depurar a saúde do Supabase diretamente em produção, o usuário DEV possui acesso exclusivo ao painel de telemetria com as seguintes métricas:

- **Medição de Ping/Latência:** Calcula o tempo decorrido de uma consulta direta de leitura à tabela `config_app` no Supabase em milissegundos.
- **Checagem de Saúde de Conexão:** Valida se as requisições estão alcançando o banco remoto, identificando quedas ou conexões nulas (`🟢 Saudável (Online)` / `🔴 Sem Conexão / Erro`).
- **Ver Payload JSON:** Exibe e permite copiar o estado completo de `window.DB` em formato JSON embelezado.
- **Teste de Escrita Direto:** Força a gravação de um backup no Supabase através do método `upsert` na linha `id: 1` e calcula o tempo total de resposta de escrita em milissegundos.
