-- First create tables without foreign key references
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    balance NUMERIC(10, 2) DEFAULT 0
);

CREATE TABLE races (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP,
    winner_id INTEGER -- We'll add the foreign key constraint later
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    race_id INTEGER REFERENCES races(id),
    name VARCHAR(255) NOT NULL,
    odds NUMERIC(5, 2) NOT NULL
);

CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    race_id INTEGER REFERENCES races(id),
    player_id INTEGER REFERENCES players(id),
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled BOOLEAN DEFAULT FALSE,
    winnings NUMERIC(10, 2) DEFAULT 0
);

-- Now add the foreign key constraint to races table
ALTER TABLE races 
ADD CONSTRAINT fk_winner_player 
FOREIGN KEY (winner_id) REFERENCES players(id); 