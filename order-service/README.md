# order-service

API REST responsável pelo gerenciamento de ordens e autenticação de usuários. É o serviço de borda que o frontend consome.

## Stack

- **Java 21** + **Spring Boot 3.3**
- **Spring Security + JWT** para autenticação stateless
- **Spring Data JPA + PostgreSQL** para persistência de ordens e usuários
- **Spring Data Redis** para cache
- **Spring Cloud OpenFeign** para chamadas ao `payment-processor`
- **Spring Cloud AWS 3.2 (SQS)** para consumir status PIX da fila
- **Flyway** para migrations
- **Springdoc OpenAPI** para documentação Swagger

## Estrutura

```
order-service/
├── src/main/java/com/exemplo/orderservice/
│   ├── auth/                # AuthController, AuthService, JWT, AuthFilter
│   ├── user/                # UserController, UserService, User entity
│   └── order/
│       ├── controller/      # OrderController (POST/GET)
│       ├── service/         # OrderService (regras de negócio)
│       ├── client/          # PaymentProcessorClient (Feign)
│       ├── listener/        # PaymentPixStatusListener (SQS)
│       ├── repository/      # OrderRepository (JPA)
│       ├── model/           # Order entity
│       ├── dto/             # Requests, Responses e mensagens SQS
│       └── exception/       # OrderAlreadyExistsException, etc.
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/        # scripts Flyway
└── localstack/init/         # script de criação das filas SQS no LocalStack
```

## Fluxo principal

1. **POST /api/orders** — cria ordem, persiste no Postgres como `PENDENTE_PAGAMENTO` e chama o `payment-processor` via Feign
2. Se método ≠ PIX → atualiza a ordem com o status final retornado
3. Se método = PIX → ordem fica pendente; o `payment-processor` publica na fila SQS `pagamento-pix-pendente.fifo`, processa aleatoriamente e devolve resultado na fila `pagamento-pix-status`
4. **PaymentPixStatusListener** consome `pagamento-pix-status`, atualiza a ordem no Postgres e notifica o `payment-processor` via PATCH para manter o Mongo consistente
5. **GET /api/orders?cpf_comprador=...** — lista ordens do comprador (frontend faz polling até o status mudar)

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login (retorna JWT) |
| POST | `/api/users` | Cadastro de usuário |
| POST | `/api/orders` | Cria ordem (requer JWT) |
| GET | `/api/orders?cpf_comprador=XXX` | Lista ordens por CPF (requer JWT) |
| GET | `/swagger-ui.html` | Documentação interativa |

## Variáveis de ambiente

| Variável | Default | Descrição |
|---|---|---|
| `DB_HOST` | `localhost` | Host do Postgres |
| `DB_PORT` | `5432` | Porta do Postgres |
| `DB_NAME` | `orderdb` | Nome do banco |
| `DB_USER` | `orderuser` | Usuário do banco |
| `DB_PASS` | `orderpass` | Senha do banco |
| `REDIS_HOST` | `localhost` | Host do Redis |
| `REDIS_PORT` | `6379` | Porta do Redis |
| `JWT_SECRET` | (dev default) | Segredo HMAC do JWT (≥ 256 bits em prod) |
| `JWT_EXPIRATION` | `3600` | Validade do token em segundos |
| `PAYMENT_PROCESSOR_URL` | `http://localhost:8081` | Base URL do payment-processor |
| `SQS_ENDPOINT` | `http://localhost:4566` | Endpoint SQS (LocalStack em dev) |
| `SQS_PIX_STATUS_QUEUE` | `pagamento-pix-status` | Nome da fila de status PIX |
| `AWS_REGION` | `us-east-1` | Região AWS |
| `AWS_ACCESS_KEY_ID` | `test` | Credencial (LocalStack aceita qualquer) |
| `AWS_SECRET_ACCESS_KEY` | `test` | Credencial (LocalStack aceita qualquer) |

## Rodando localmente

Pré-requisitos: Java 21, Maven 3.9+, Postgres, Redis, LocalStack (ou stack completo via Docker).

```bash
# subir apenas as dependências de infraestrutura
docker compose up -d postgres redis localstack

# rodar a aplicação
mvn spring-boot:run
```

API disponível em `http://localhost:8080`. Swagger em `http://localhost:8080/swagger-ui.html`.

## Rodando via Docker

A partir da raiz do repositório:

```bash
docker compose up --build order-service
```
