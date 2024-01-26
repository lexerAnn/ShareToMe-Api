-- Create the 'uuid-ossp' extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'notes' table
CREATE TABLE IF NOT EXISTS "notes" (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    title VARCHAR(400) NOT NULL,
    link VARCHAR(300) NOT NULL,
    date VARCHAR(100) NOT NULL,
    time VARCHAR(100) NOT NULL,
    account_id uuid NOT NULL REFERENCES "user_account" (id)
);
