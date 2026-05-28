# Sistema de Ordens

Sistema de gerenciamento de ordens com processamento de pagamentos (PIX, crédito e débito).

## Como iniciar

Na **raiz do repositório**, execute:

```bash
docker compose up --build
```

Aguarde até todos os containers ficarem prontos (na primeira vez pode demorar alguns minutos para baixar imagens e fazer build).

## Acessos


 Frontend  http://localhost:3000 
caso queria acessar o swagger | http://localhost:8080/swagger-ui.html |

## Como usar
criei esse usuario para que voces acessem o site e criem o usuario de voces, ou teste com o admin caso queira 
1. Acesse http://localhost:3000
2. **Faça login com o usuário padrão**:
   - **Login**: `admin`
   - **Senha**: `123`

   _Esse usuário é criado automaticamente no primeiro startup. Você também pode cadastrar novos usuários em **Cadastro**._
3. Em **Ordens**, clique em **"+ Nova ordem"** e preencha os campos
4. Para PIX, o status é atualizado automaticamente em até 10 segundos

## Parando o projeto

```bash
docker compose down
```

Para apagar também os dados dos bancos:

```bash
docker compose down -v
```
