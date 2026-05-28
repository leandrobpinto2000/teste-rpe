CREATE TABLE orders (
    id              UUID                       PRIMARY KEY,
    id_item         UUID                       NOT NULL,
    valor           NUMERIC(19, 2)             NOT NULL,
    meio_pagamento  VARCHAR(20)                NOT NULL,
    nome_comprador  VARCHAR(255)               NOT NULL,
    cpf_comprador   VARCHAR(14)                NOT NULL,
    status          VARCHAR(30)                NOT NULL DEFAULT 'PENDENTE_PAGAMENTO',
    data_criacao    TIMESTAMP WITH TIME ZONE   NOT NULL DEFAULT now(),
    data_pagamento  TIMESTAMP WITH TIME ZONE
);
