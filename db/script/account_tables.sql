CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "user_account" CASCADE;
CREATE TABLE IF NOT EXISTS "user_account" (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  time_stamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS account_tokens CASCADE;
CREATE TABLE IF NOT EXISTS account_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(500) NOT NULL,
  token_type VARCHAR(10) CHECK (token_type IN ('refresh', 'reset_password', 'verify_email', 'access')) NOT NULL,
  expires DATE NOT NULL,
  account_id uuid NOT NULL REFERENCES "user_account" (id),
  time_stamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (account_id, token_type)
);