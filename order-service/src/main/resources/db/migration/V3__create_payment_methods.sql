CREATE TABLE payment_methods (
    id         VARCHAR(20)   PRIMARY KEY,
    descricao  VARCHAR(100)  NOT NULL
);

INSERT INTO payment_methods (id, descricao) VALUES
    ('PIX',     'Pagamento via PIX'),
    ('CREDITO', 'Cartao de Credito'),
    ('DEBITO',  'Cartao de Debito');
