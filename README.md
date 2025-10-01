# Conéctar Frontend

[Documentação completa aqui](/docs/introduction.md)

Demo Frontend: http://conectar-frontend-xi.vercel.app

API (Swagger): https://conectar-api.wachannel.com.br/docs

Repo Backend: https://github.com/uisam00/conectar-backend

## Usuário de teste

Use as credenciais abaixo para acessar o sistema em desenvolvimento:

```json
{
  "email": "fulano@example.com",
  "password": "Senha!123"
}
```

## Tecnologias

- **React 19** com TypeScript
- **Vite** como bundler
- **React Router** para roteamento
- **Material-UI** para componentes
- **Tailwind CSS** para estilos
- **React Hook Form** para formulários
- **TanStack Query** para gerenciamento de estado
- **i18next** para internacionalização

## Funcionalidades

- ✅ Autenticação completa (login, registro, perfil)
- ✅ Gerenciamento de usuários
- ✅ Upload de arquivos
- ✅ Modo escuro/claro
- ✅ Internacionalização
- ✅ Formulários com validação
- ✅ Notificações toast

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp env.example .env.local
   ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── form/           # Componentes de formulário
│   └── theme/          # Tema e cores
├── pages/              # Páginas da aplicação
├── services/           # Lógica de negócio
│   ├── api/            # Chamadas de API
│   ├── auth/           # Autenticação
│   ├── i18n/           # Internacionalização
│   └── react-query/    # Gerenciamento de estado
├── hooks/              # Hooks customizados
└── types/              # Tipos TypeScript
```

## API

O projeto está configurado para trabalhar com a API NestJS fornecida. Certifique-se de que a API esteja rodando na URL configurada no arquivo `.env.local`.

## Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter
