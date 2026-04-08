# Plano de Refatoração: Lazy Loading e Nested Routing

## Estratégia 1: Extração de Componentes e Lazy Loading
O objetivo é reduzir o tamanho do primeiro carregamento do app (bundle inicial).

### Etapas:
1. **Componentização do Admin:**
   - Criar `AdminDashboard.jsx` para as estatísticas.
   - Criar `AdminListaItens.jsx` para a tabela de gerenciamento.
2. **Lazy Loading no App.jsx:**
   - Substituir `import Pagina from './paginas/Pagina'` por `const Pagina = React.lazy(() => import('./paginas/Pagina'))`.
   - Envolver o roteamento em um `<Suspense fallback={<Loading />}>`.

## Estratégia 2: Roteamento Aninhado Nativo (Nested Routing)
Garantir que as seções do painel administrativo tenham URLs próprias.

### Etapas:
1. **Configuração de sub-rotas no App.jsx:**
   - Transformar a rota `/admin` em um container pai.
   - Adicionar sub-rotas: `/admin/dashboard` (índice), `/admin/itens`, `/admin/usuarios`.
2. **Implementação do Outlet no Admin.jsx:**
   - O componente `Admin.jsx` passará a ser um layout que contém a navegação superior e o componente `<Outlet />` para renderizar o conteúdo da aba ativa.

## Benefícios
- **Performance:** Carregamento sob demanda das páginas.
- **Bookmarkable URLs:** Usuários podem salvar links diretos para seções administrativas específicas.
- **Código Limpo:** Responsabilidades separadas em arquivos menores e específicos.
