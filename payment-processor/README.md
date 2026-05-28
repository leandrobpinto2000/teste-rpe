# payment-processor

Microserviço de processamento de pagamentos. Recebe solicitações do `order-service`, simula a aprovação/recusa de pagamentos e cuida do fluxo assíncrono de PIX via SQS.

## Stack

- **NestJS 10** + **TypeScript**
- **MongoDB** + **Mongoose** para persistência dos pagamentos
- **@aws-sdk/client-sqs** para produção/consumo de mensagens SQS
- **class-validator** para validação de DTOs

## Estrutura

```
payment-processor/
├── src/
│   ├── payments/
│   │   ├── payments.controller.ts       # POST /payments, PATCH /payments/:id/status
│   │   ├── payments.service.ts          # regras de negócio + producer SQS
│   │   ├── pix-consumer.service.ts      # consumer da fila pagamento-pix-pendente.fifo
│   │   ├── dto/
│   │   └── schemas/                     # Mongoose schemas
│   ├── sqs/
│   │   ├── sqs.module.ts                # Global Module
│   │   └── sqs.service.ts               # wrapper genérico para SQS
│   ├── common/filters/                  # HttpExceptionFilter global
│   ├── app.module.ts
│   └── main.ts
```

## Fluxo principal

### Pagamento não-PIX (CRÉDITO / DÉBITO)

1. `POST /payments` recebe o body do order-service
2. Aplica a regra de "1 em 5 falha" (counter interno)
3. Persiste no Mongo com `status_pagamento` final (`PAGO`, `RECUSADO` ou `CANCELADO`)
4. Retorna 200 com o status

### Pagamento PIX (assíncrono via SQS)

1. `POST /payments` recebe o body, salva no Mongo como `PENDENTE_PAGAMENTO`
2. Publica `{ id_ordem }` na fila **`pagamento-pix-pendente.fifo`** (com `MessageGroupId = id_ordem`)
3. **`PixConsumerService`** (long-polling, ciclo de vida `OnApplicationBootstrap`) lê da fila pendente
4. Sorteia aleatoriamente um status entre `PAGO`, `CANCELADO`, `REPROVADO`
5. Publica `{ id_ordem, status }` na fila **`pagamento-pix-status`**
6. Deleta a mensagem da fila pendente
7. O `order-service` consome a fila de status, atualiza a ordem e chama `PATCH /payments/:idOrdem/status` para refletir a atualização no Mongo

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/payments` | Processa um pagamento (chamado pelo order-service via Feign) |
| PATCH | `/payments/:idOrdem/status` | Atualiza o status do pagamento (chamado pelo order-service após receber status PIX da fila) |

## Variáveis de ambiente

| Variável | Default | Descrição |
|---|---|---|
| `PORT` | `8081` | Porta HTTP |
| `MONGO_URI` | `mongodb://localhost:27017/payments` | Connection string do MongoDB |
| `SQS_ENDPOINT` | `http://localhost:4566` | Endpoint SQS (LocalStack em dev) |
| `SQS_PIX_PENDENTE_QUEUE` | `pagamento-pix-pendente.fifo` | Fila FIFO de PIX a processar |
| `SQS_PIX_STATUS_QUEUE` | `pagamento-pix-status` | Fila de status final |
| `AWS_REGION` | `us-east-1` | Região AWS |
| `AWS_ACCESS_KEY_ID` | `test` | Credencial (LocalStack aceita qualquer) |
| `AWS_SECRET_ACCESS_KEY` | `test` | Credencial (LocalStack aceita qualquer) |

## Rodando localmente

Pré-requisitos: Node.js 20+, MongoDB, LocalStack (ou stack completo via Docker).

```bash
# subir apenas as dependências
docker compose up -d mongo localstack

npm install
npm run start:dev   # modo watch
# ou
npm run start
```

Aplicação disponível em `http://localhost:8081`.

## Rodando via Docker

A partir da raiz do repositório:

```bash
docker compose up --build payment-processor
```
