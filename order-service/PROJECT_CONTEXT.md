# Contexto do Projeto — Teste Técnico Pleno (order-service)

Documento para passar adiante (outra IA ou pessoa) com tudo necessário para continuar o projeto.

---

## 1. Visão geral

Projeto de teste técnico pleno composto por **três aplicações** que se comunicam:

- **`order-service`** (este repositório) — Java 21 + Spring Boot 3.3.5. Gerencia ordens, autenticação JWT, meios de pagamento.
- **`payment-processor`** — Golang (preferencial) ou Node.js. Processa pagamentos. **Ainda não implementado** — substituído por um stub interno em Java.
- **`order-web`** — Front em React + Tailwind ou Angular. **Ainda não implementado**.

Comunicação entre serviços: HTTP via Feign Client (síncrono) + AWS SQS via LocalStack (assíncrono, para fluxo PIX).

---

## 2. Stack técnica (escolhida)

| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 (LTS) |
| Framework | Spring Boot 3.3.5 |
| Build | Maven (com `mvnw` wrapper) |
| Banco SQL | PostgreSQL 16 |
| Cache | Redis 7 |
| Migrations | Flyway |
| Segurança | Spring Security + JWT (jjwt 0.12.6, HMAC-SHA256) |
| Validação | jakarta.validation (Bean Validation) |
| Observabilidade | Spring Actuator (health, info) |
| Documentação | springdoc-openapi 2.6.0 → Swagger UI em `/swagger-ui.html` |
| Lombok | 1.18.38 |
| Containers | Docker Compose (Postgres + Redis + app) |

---

## 3. Enunciado completo da prova

### Stack permitida
- Linguagem: Java 21/25 (LTS), Golang, Node.js
- Frameworks: Spring Boot 3.x / Gin, Fiber, Chi / Nest.js, Express
- Comunicação: Spring Cloud (OpenFeign), Axios
- Mensageria: AWS SQS (LocalStack), RabbitMQ
- Persistência: PostgreSQL + Redis (cache)
- Segurança: Spring Security, JWT
- Observabilidade: Spring Actuator
- Front: React (Vite/Next.js) ou Angular, Tailwind CSS

### `order-service` (Java obrigatório)

Cinco endpoints. Apenas **login**, **criar usuário** e **listagem de meios de pagamento** dispensam token.

#### 1. Criar usuário
- Recebe `login` e `senha`.
- `login` único.
- Senha encriptada no banco (BCrypt).
- Validação de complexidade de senha = diferencial.

#### 2. Login
- Recebe `login` e `senha`.
- Retorna Bearer Token JWT.

#### 3. Criar ordem
- Body: `id`, `id_item`, `valor`, `meio_pagamento`, `nome_comprador`, `cpf_comprador`.
- Requer JWT válido + role específica.
- Salva em base relacional (Postgres).
- Adiciona colunas: `status` (default `PENDENTE_PAGAMENTO`), `data_criacao`, `data_pagamento` (null inicialmente).
- Após salvar, envia para `payment-processor` via **Feign Client**.
- Reflete retorno do payment-processor: status pode virar `PAGO`, `CANCELADO` ou `RECUSADO` e preenche `data_pagamento`.

**Regras de validação:**
- `valor` não nulo, não zero, não negativo.
- `meio_pagamento` ∈ {`PIX`, `CREDITO`, `DEBITO`}.
- `nome_comprador` não nulo/vazio, > 3 caracteres.
- `cpf_comprador` não nulo/vazio, CPF válido.
- `id` único (sequencial ou UUID).
- `id_item` UUID.
- `status` ∈ {`PENDENTE_PAGAMENTO`, `PAGO`, `CANCELADO`, `RECUSADO`}.

#### 4. Listagem de status da ordem
- Recebe `cpf_comprador`.
- Retorna lista de `{id, nome_comprador, status}`.

#### 5. Listagem de meios de pagamento
- Sem endpoint de criação — inserir direto no banco.
- Campos: `id`, `descricao`.
- Cache via Redis, invalidação a cada 30 minutos.

### `payment-processor` (Go preferencial)

Sem autenticação. Dois endpoints.

#### Processamento do pagamento
- Recebe: `id_ordem`, `id_item`, `valor`, `meio_pagamento`, `nome_comprador`, `cpf_comprador`.
- Persiste em base NoSQL junto com `data_processamento`, `status_pagamento` (default `PENDENTE_PAGAMENTO`), `data_pagamento` (preenchida pelo retorno do `payment-gateway`).
- **Cartão (CREDITO/DEBITO):** status final `PAGO`, `CANCELADO` ou `RECUSADO`. Random (ex.: a cada 5, 1 falha) = diferencial.
- **PIX:** sempre `PENDENTE_PAGAMENTO` + envia mensagem para fila SQS `pagamento-pix-pendente` (FIFO) com `id_ordem`.

#### Consumer da fila `pagamento-pix-pendente`
- Consome o `id_ordem`.
- Envia nova mensagem para a fila SQS `pagamento-pix-status` (Standard) com `{id_ordem, status}` aleatório entre `PAGO`, `CANCELADO`, `REPROVADO`.

#### Endpoint de alteração de status
- Recebe `id_ordem`, `status_pagamento`, `data_pagamento`.
- Atualiza o registro no NoSQL. Sem body de retorno.
- **Fluxo exclusivo PIX.**

### `order-web`

- React (Vite/Next.js) ou Angular + Tailwind.
- Telas:
  - Login (consome endpoint de login do order-service).
  - Cadastro de usuário (opcional).
  - Landing page com criação de ordem (combobox de meios de pagamento) e listagem de ordens.
  - Para PIX, fazer polling até identificar mudança de status.

### Fluxo da fila `pagamento-pix-status` (no order-service)

- Listener escuta a fila.
- Pega `id_ordem` + `status`.
- Consulta a ordem na base e atualiza `status` + `data_pagamento`.
- Após salvar, faz request HTTP para o endpoint de "alteração de status" do `payment-processor` para alinhar o estado nos dois serviços.

### Diferenciais (Plus)
- Go ou Node.js + TypeScript no `payment-processor`.
- Angular no front.
- Resilience4j (circuit breaker, timeout).
- Solução para lentidão/falha do `payment-gateway` em comunicação síncrona.
- Logs no ELK via docker-compose.
- Integração Datadog.
- Kong (ou similar) como API gateway.
- Virtual Threads, CompletableFuture.

### Esperado (prioritário)
- Autenticação JWT.
- SQS via LocalStack.
- Dockerfiles funcionais.
- Logs estruturados.
- Spring Actuator (health + info).
- Java 21/25 LTS.
- Redis para cache.
- Testes unitários.
- SQL + NoSQL.
- docker-compose com toda a infra.
- Swagger no order-service.
- README.md com documentação funcional.
- SOLID, padrões, Clean Code, Clean Architecture ou Hexagonal.
- Erros estruturados: `{statusCode, message, ...}`.

---

## 4. Decisões já tomadas

| Decisão | Justificativa |
|---|---|
| **`payment-processor` ainda não foi implementado.** No lugar, há um `PaymentStubService` Java que retorna status aleatório para cartão e `PENDENTE_PAGAMENTO` para PIX. | Foco inicial no order-service. O usuário pediu "go horse" enquanto o serviço Go não existe. |
| Stub é chamado **diretamente como bean Spring** (sem Feign nem HTTP). | Simplicidade. Quando o serviço Go existir, troca para Feign Client e o `OrderService` quase não muda. |
| **Sem SQS/LocalStack ainda.** | Não há `payment-processor` real para produzir/consumir mensagens. Adicionar quando o serviço Go subir. |
| **Sem front-end ainda.** | Backend primeiro. |
| Senha de usuário usa BCrypt strength 12 + regex (mín 8 chars, 1 letra, 1 número). | Diferencial cumprido. |
| Validação de CPF puro Java no `CpfValidator` (algoritmo Receita). | Sem dependência externa. |
| Pacotes por feature (`user`, `order`, `paymentmethod`, `shared`). | Aproximação de Clean Architecture/Hexagonal sem ser dogmático. |

---

## 5. Estado atual do `order-service`

### Implementado
- [x] Cadastro de usuário (`POST /api/users`) — público
- [x] Login JWT (`POST /api/auth/login`) — público
- [x] Criar ordem (`POST /api/orders`) — requer JWT + role `ROLE_ORDER_CREATOR`
- [x] Listar ordens por CPF (`GET /api/orders?cpf_comprador=...`) — requer JWT
- [x] Listar meios de pagamento (`GET /api/payment-methods`) — público, cache Redis 30 min
- [x] Swagger UI em `/swagger-ui.html` ("API de Servico de Ordens")
- [x] Actuator health/info (`/actuator/health`, `/actuator/info`)
- [x] Validações de campos da ordem (todas as regras do enunciado)
- [x] CPF válido pelo algoritmo da Receita (`CpfValidator`)
- [x] Erros estruturados (`ErrorResponse` com `statusCode`, `message`, `timestamp`, `path`, `fields`)
- [x] Postgres + Flyway (migrations V1, V2, V3)
- [x] Redis para cache
- [x] Spring Security + JWT (HMAC-SHA256, jjwt)
- [x] Logs estruturados com `traceId`/`spanId` no padrão
- [x] Dockerfile + docker-compose (postgres + redis + app)

### Pendente
- [ ] Testes unitários para `Order*` e `PaymentMethod*` (já existem para `User*` e `Auth*`)
- [ ] Testes de integração e e2e (diferencial)
- [ ] `payment-processor` real em Go com MongoDB
- [ ] Substituir stub Java por Feign Client apontando para o Go
- [ ] Adicionar SQS (LocalStack) ao docker-compose
- [ ] Filas: `pagamento-pix-pendente` (FIFO) e `pagamento-pix-status` (Standard)
- [ ] Listener no order-service para `pagamento-pix-status`
- [ ] Endpoint callback no order-service que o `payment-processor` chama para atualizar status (alternativa ao retorno síncrono)
- [ ] Endpoint no payment-processor `PUT/PATCH /payments/{id}/status` (consumido pelo order-service após processar PIX)
- [ ] Front-end React/Vite com Tailwind
- [ ] Resilience4j (circuit breaker + timeout) entre order-service e payment-processor
- [ ] Logs no ELK / Datadog (diferenciais)
- [ ] Gateway Kong (diferencial)

---

## 6. Arquitetura / organização de pacotes

```
com.exemplo.orderservice
├── OrderServiceApplication              # main
├── user
│   ├── controller/  (UserController, AuthController)
│   ├── service/     (UserService, AuthService)
│   ├── model/       (User, Role enum)
│   ├── repository/  (UserRepository)
│   ├── dto/         (CreateUserRequest, CreateUserResponse, LoginRequest, TokenResponse)
│   ├── mapper/      (UserMapper)
│   └── exception/   (UserAlreadyExistsException, InvalidCredentialsException)
├── order
│   ├── controller/  (OrderController)
│   ├── service/     (OrderService)
│   ├── stub/        (PaymentStubService — substitui payment-processor)
│   ├── model/       (Order, OrderStatus enum, PaymentMethod enum)
│   ├── repository/  (OrderRepository)
│   ├── dto/         (CreateOrderRequest, CreateOrderResponse, OrderStatusResponse, PaymentStubResponse)
│   └── exception/   (OrderAlreadyExistsException)
├── paymentmethod
│   ├── controller/  (PaymentMethodController)
│   ├── service/     (PaymentMethodService — @Cacheable)
│   ├── model/       (PaymentMethodEntity)
│   ├── repository/  (PaymentMethodRepository)
│   └── dto/         (PaymentMethodResponse)
└── shared
    ├── config/      (CacheConfig, OpenApiConfig)
    ├── exception/   (GlobalExceptionHandler, ErrorResponse, FieldErrorItem)
    ├── security/    (SecurityConfig, JwtService, JwtAuthenticationFilter, JwtProperties, CustomUserDetailsService)
    └── validation/  (Cpf annotation, CpfValidator)
```

Roles do usuário em `Role.java`: `ROLE_USER`, `ROLE_ADMIN`, `ROLE_ORDER_CREATOR`. Ao criar, o usuário recebe automaticamente `ROLE_ORDER_CREATOR`.

---

## 7. Como rodar

### Pré-requisitos
- Docker Desktop
- Java 21 (Eclipse Adoptium recomendado) — só se for rodar app local
- Maven via `mvnw.cmd` (já no projeto)

### Opção A — app local + infra no Docker
```powershell
docker compose up -d postgres redis
.\mvnw spring-boot:run
```

### Opção B — tudo no Docker
```powershell
docker compose up --build
```

App em `http://localhost:8080`. Swagger em `http://localhost:8080/swagger-ui.html`.

### Resetar dados
```powershell
docker compose down -v
```

---

## 8. Fluxo de teste no Postman

### 1) Criar usuário (público)
`POST http://localhost:8080/api/users`
```json
{
  "login": "joao.silva",
  "senha": "MinhaSenha123"
}
```
→ 201 Created

### 2) Login (público)
`POST http://localhost:8080/api/auth/login`
```json
{
  "login": "joao.silva",
  "senha": "MinhaSenha123"
}
```
→ 200 OK com `{ token, ... }`. Copiar `token`.

### 3) Criar ordem (requer Bearer Token)
`POST http://localhost:8080/api/orders`
Header: `Authorization: Bearer <token>`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "idItem": "660e8400-e29b-41d4-a716-446655440001",
  "valor": 150.00,
  "meioPagamento": "CREDITO",
  "nomeComprador": "Joao Silva",
  "cpfComprador": "19193412770"
}
```
→ 201 Created. Para CREDITO/DEBITO o status final é aleatório entre `PAGO`, `CANCELADO`, `RECUSADO`. Para PIX é sempre `PENDENTE_PAGAMENTO`.

### 4) Listar ordens por CPF (requer Bearer Token)
`GET http://localhost:8080/api/orders?cpf_comprador=19193412770`
→ 200 OK com `[{id, nomeComprador, status}]`.

### 5) Listar meios de pagamento (público)
`GET http://localhost:8080/api/payment-methods`
→ 200 OK com `[{id, descricao}]`. Cacheado por 30 min — só vai ao Postgres na primeira chamada (log: `cache miss`).

---

## 9. Regras de validação (CreateOrderRequest)

| Campo | Validação | Erro |
|---|---|---|
| `id` | `@NotNull`, UUID, único no banco | 400 / 409 |
| `idItem` | `@NotNull`, UUID | 400 |
| `valor` | `@NotNull`, `@DecimalMin("0.01")` | 400 |
| `meioPagamento` | `@NotNull`, enum `PaymentMethod` | 400 |
| `nomeComprador` | `@NotBlank`, `@Size(min=4)` | 400 |
| `cpfComprador` | `@NotBlank`, `@Cpf` (algoritmo Receita Federal) | 400 |

---

## 10. Próximos passos sugeridos (ordem de prioridade)

1. **Criar `payment-processor` em Go** com Gin + MongoDB. Dois endpoints:
   - `POST /payments` → recebe ordem, persiste, retorna status.
   - `PUT /payments/{id}/status` → recebe atualização de status (usado depois pelo fluxo PIX).
2. **Trocar `PaymentStubService` por Feign Client** no order-service. Apontar para `http://payment-processor:8081` (no docker-compose).
3. **Adicionar LocalStack (SQS) ao `docker-compose.yml`** e criar as filas:
   - `pagamento-pix-pendente.fifo`
   - `pagamento-pix-status` (Standard)
4. **No `payment-processor`:** para PIX, enviar `id_ordem` na fila `pagamento-pix-pendente.fifo`.
5. **No `payment-processor`:** Consumer da fila `pagamento-pix-pendente.fifo` → manda para `pagamento-pix-status` com status aleatório.
6. **No `order-service`:** Listener da fila `pagamento-pix-status` → atualiza ordem no banco + chama `PUT /payments/{id}/status` do payment-processor.
7. **Front-end React/Vite + Tailwind**: tela de login, cadastro (opcional), landing com criar ordem + listar ordens (com polling pra PIX).
8. **Testes**: unit (faltam Order/PaymentMethod), integração (Testcontainers), e2e.
9. **Resilience4j** entre order-service e payment-processor: timeout + circuit breaker para evitar travamento se o Go cair.
10. **Diferenciais**: virtual threads (`spring.threads.virtual.enabled=true` no Spring Boot 3.2+), Datadog/ELK, Kong gateway.

---

## 11. Ambiente local — credenciais e portas

| Serviço | Host | Porta | Credenciais |
|---|---|---|---|
| Postgres | localhost | 5432 | db `orderdb` / user `orderuser` / pwd `orderpass` |
| Redis | localhost | 6379 | sem auth |
| App | localhost | 8080 | — |

JWT secret (dev) em [application.yml](src/main/resources/application.yml#L30): trocar via env `JWT_SECRET` em produção. Expiração: 1h.

---

## 12. Comandos úteis

```powershell
# Subir infra
docker compose up -d postgres redis

# Rodar app local
.\mvnw spring-boot:run

# Compilar sem rodar
.\mvnw compile

# Rodar testes
.\mvnw test

# Reset total (apaga volume do Postgres)
docker compose down -v

# Ver logs do app via docker
docker logs -f order-service-app

# Conectar no Postgres
docker exec -it order-service-postgres psql -U orderuser -d orderdb

# Verificar o que tem no Redis
docker exec -it order-service-redis redis-cli
> KEYS *
> GET payment-methods::all
```

---

## 13. Arquivos-chave para entender o projeto

- [pom.xml](pom.xml) — dependências
- [docker-compose.yml](docker-compose.yml) — infra local
- [application.yml](src/main/resources/application.yml) — config Spring
- [SecurityConfig.java](src/main/java/com/exemplo/orderservice/shared/security/SecurityConfig.java) — rotas públicas e auth JWT
- [OrderService.java](src/main/java/com/exemplo/orderservice/order/service/OrderService.java) — orquestra criação de ordem e chamada ao stub
- [PaymentStubService.java](src/main/java/com/exemplo/orderservice/order/stub/PaymentStubService.java) — substitui o payment-processor por ora
- [PaymentMethodService.java](src/main/java/com/exemplo/orderservice/paymentmethod/service/PaymentMethodService.java) — cache com `@Cacheable`
- [CpfValidator.java](src/main/java/com/exemplo/orderservice/shared/validation/CpfValidator.java) — algoritmo de validação
- [GlobalExceptionHandler.java](src/main/java/com/exemplo/orderservice/shared/exception/GlobalExceptionHandler.java) — erros estruturados
- Migrations: `src/main/resources/db/migration/V1__create_users_and_roles.sql`, `V2__create_orders.sql`, `V3__create_payment_methods.sql`
