# ClinicOps - Plataforma SaaS de Gestão de Clínicas

## Estrutura do Projeto
- `/web`: Aplicação Web (Next.js 16, Tailwind, shadcn/ui).
- `/mobile`: Aplicação Mobile (Expo, React Native).
- `/supabase/migrations`: Scripts SQL para configurar o banco de dados.

## Configuração

### 1. Banco de Dados (Supabase)
1. Crie um projeto no Supabase.
2. Vá em SQL Editor e execute o conteúdo do arquivo `supabase/migrations/20240127000000_initial_schema.sql`.
3. Obtenha a URL e a API Key (Anon) nas configurações do projeto.

### 2. Aplicação Web
1. Entre na pasta `web`: `cd web`
2. Crie um arquivo `.env.local` com suas credenciais:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_aqui
   ```
3. Instale as dependências: `npm install`
4. Rode o projeto: `npm run dev`

### 3. Aplicação Mobile
1. Entre na pasta `mobile`: `cd mobile`
2. Instale as dependências: `npm install`
3. Rode o projeto: `npx expo start`
