# Zunga - Mercado Social de Artigos Usados em Angola

Aplicação web completa desenvolvida com React, Vite, Tailwind CSS e TypeScript.

## Funcionalidades Principais:
1. **Cadastro e Perfil de Utilizador:** Localização por Província, Cidade e Bairro em Angola, indicador de presença "Ativo agora" / "Visto por último".
2. **Publicação de Anúncios:** Preço fixo ou Leilão público com contagem decrescente e lances ao vivo.
3. **Interações Sociais:** Reações públicas (Gosto, Top, Bom Negócio, Quero Negociar) e avaliações de reputação no perfil do vendedor.
4. **Mensagens Diretas:** Chat privado com ferramentas de negociação e pontos de encontro seguros (Shoprite, Kero, Candando, Bombas Sonangol, Shoppings).
5. **Modo de Baixo Consumo de Dados:** Modo texto otimizado para redes móveis em Angola (Unitel / Africell / Movicel), economizando dados.
6. **Filtro de Pesquisa por Cidade e Bairro:** Busca detalhada por províncias, municípios e bairros angolanos.

## Como Executar Localmente:

1. Instale o Node.js (versão 18 ou superior): https://nodejs.org
2. Abra a pasta do projeto no terminal e instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra o navegador em: `http://localhost:3000`

## Gerar Versão de Produção:
```bash
npm run build
```
Os arquivos finais ficarão na pasta `dist/`.
