# Sistema de Ordens

Sistema completo de gerenciamento de ordens com processamento de pagamentos (PIX, crédito e débito).

## Pré-requisitos

- **Docker** e **Docker Compose** instalados (Docker Desktop ≥ 24 no Windows/Mac, ou Docker Engine + Compose Plugin no Linux)

## Como iniciar

Na **raiz do repositório**, execute:

```bash
docker compose up --build
```

Aguarde até todos os containers ficarem prontos (na primeira vez pode demorar alguns minutos para baixar imagens e fazer build).

## Acessos

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API (Swagger) | http://localhost:8080/swagger-ui.html |

## Como usar

1. Acesse http://localhost:3000
2. Crie um usuário em **Cadastro**
3. Faça login
4. Em **Ordens**, clique em **"+ Nova ordem"** e preencha os campos
5. Para PIX, o status é atualizado automaticamente em até 10 segundos

## Parando o projeto

```bash
docker compose down
```

Para apagar também os dados dos bancos:

```bash
docker compose down -v
```
