CREATE TABLE users (
    id          UUID PRIMARY KEY,
    login       VARCHAR(100)               NOT NULL UNIQUE,
    password    VARCHAR(255)               NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE   NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
    user_id  UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role     VARCHAR(50)  NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE INDEX idx_users_login ON users (login);
