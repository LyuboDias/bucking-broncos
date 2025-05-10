-- Add second and third place columns to races table
ALTER TABLE races ADD COLUMN second_place_id INTEGER REFERENCES players(id);
ALTER TABLE races ADD COLUMN third_place_id INTEGER REFERENCES players(id);

-- Update bets table to add place_rank field to track winnings for different places
ALTER TABLE bets ADD COLUMN place_rank INTEGER DEFAULT NULL;
COMMENT ON COLUMN bets.place_rank IS '1 for first place, 2 for second place, 3 for third place, NULL if bet lost'; 