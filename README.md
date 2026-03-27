        # ConveniênciaPRO - Arquitetura e Planejamento

Este diretório contém a estrutura refatorada e organizada do projeto original. Todo o código que estava compactado num único arquivo HTML agora está divido da maneira correta:

## 📁 Estrutura Atual
*   `index.html` - É a casca do app. Possui as `divs` principais, o Modal e a Sidebar, chamando os arquivos externos.
*   `css/style.css` - Contém todo o visual da aplicação (cores, botões, modais).
*   `app.js` - Arquivo onde fica a "inteligência" do sistema (Vendas, Produtos, Dados, Relatórios). *Obs: Ele está centralizado num só arquivo propositalmente para que você possa continuar abrindo o `index.html` diretamente da sua pasta (com dois cliques) sem dar Erros de CORS no navegador (que ocorrem ao usar módulos ES6 locais via "file://").*
*   `DATABASE_SCHEMA.sql` - O projeto para a futura migração para nuvem (Supabase).

---

## 🔒 Migrando do LocalStorage para Nuvem (O Esquema Mapeado)

Conforme combinado, **fiz o mapeamento ideal de arquitetura para suprir as deficiências do esquema de gravação local**. A migração consistirá em levar as informações do navegador atual para o **Supabase**.

No arquivo `DATABASE_SCHEMA.sql` estão listadas as criações reais das tabelas, com as dependências criadas de maneira Segura:

1.  **Usuários (Autenticação):** Ao em vez de um array falso no JavaScript, o Supabase exigirá E-mail e Senha e distribuirá *Tokens JWT* válidos e limitados por tempo.
2.  **Operação Atômica de Estoque:** No SQL há uma *Function* `baixar_estoque(produto_id, qtd)` programada. Em um cenário real de duas pessoas clicando em "Comprar" no mesmo microssegundo, a Function SQL empilha virtualmente as ações no backend para o estoque deduzir de maneira 100% segura. O LocalStorage *não sabe fazer isso*, ele apenas pega e joga o valor cego.
3.  **Registro Útil de Caixas (Venda vs. Venda_Itens):** Note que o esquema divide o carrinho entre uma "Cabeça da Venda" e "Sua Cauda de Itens Vendidos". Isso permite criar Dashboards SQL extremamente analíticos no futuro, ou plugar o DB no PowerBI ou Metabase.

### 📝 Próximos Passos Sugeridos para o Código JS

Quando você tiver uma hospedagem/servidor local configurado (Node.js/Vite ou VSCode LiveServer), podemos quebrar o `app.js` da seguinte forma:

*   **`api/Database.js`**: Única classe que consumirá o Banco de dados via `fetch('https://sua-url-supabase.co/rest/v1/produtos')`. Essa classe fará as rotinas pesadas de salvar e deletar. Todos os outros módulos *só conversarão com ela*, nunca com o banco diretamente.
*   **`services/Auth.js`**: Recebe credenciais da tela, encaminha pra nuvem, devolve liberação via *Token JWT* e controla o tempo para o "deslogar automático" se ocioso.
*   **`pages/Vendas.js`**: Os "templates" HTML de venda, os controllers de carrinho e os inputs.
*   **`pages/Produtos.js` / `Caixa.js` / etc**: Todas as telas.

Como seu front-end é super rápido e "Vanilla" (Puro), você não precisará reescrever em frameworks complexos se não quiser. Bastará refatorar as funções atuais `saveDB()` para virarem fluxos _`async/await`_ disparando na nuvem.
