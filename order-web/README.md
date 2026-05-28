# order-web

Frontend web da aplicação de gerenciamento de ordens. Interface para login/cadastro, criação e listagem de ordens por CPF, com acompanhamento automático do status de pagamento PIX.

## Stack

- **Next.js 14** (App Router, modo `standalone` para Docker)
- **React 18** + **TypeScript**
- **TailwindCSS** para estilização
- **React Hook Form** + **Zod** para formulários e validação
- **Axios** para chamadas HTTP
- **@tanstack/react-table** para listagem

## Estrutura

```
order-web/
├── app/
│   ├── composables/         # hooks reutilizáveis (useRequests, useListagemOrdens, useCriarOrdem, ...)
│   ├── login/               # tela de login
│   ├── cadastro/            # tela de cadastro de usuário
│   └── ordens/              # tela principal (listagem + criação)
├── components/
│   ├── ui/                  # primitives (Button, Input, Modal, CpfInput, ...)
│   ├── layout/              # AppHeader
│   └── DataTable/           # tabela reutilizável
├── features/
│   ├── auth/                # AuthContext, schemas, types
│   └── orders/              # ModalCriarOrdem, schemas, types
└── lib/                     # utilidades (cpf, cn, api-error)
```

## Funcionalidades principais

- **Autenticação JWT** persistida em `localStorage` via `AuthContext`
- **Máscara de CPF** automática (`123.456.789-00` na UI, somente dígitos no estado)
- **Polling automático** do status de pagamento PIX (10 tentativas × 1s = 10s)
- **Validação client-side** com Zod antes de enviar para a API

## Configuração

Variável de ambiente:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080   # URL do order-service
```

## Rodando localmente

```bash
npm install
npm run dev
# abre em http://localhost:3000
```

## Build de produção

```bash
npm run build
npm run start
```

## Rodando via Docker

A partir da raiz do repositório:

```bash
docker compose up --build order-web
```

O frontend ficará disponível em `http://localhost:3000`.
