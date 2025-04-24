-- Function to safely increment a user's balance
CREATE OR REPLACE FUNCTION increment_balance(row_id INTEGER, amount NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
    current_balance NUMERIC;
BEGIN
    -- Get the current balance
    SELECT balance INTO current_balance FROM users WHERE id = row_id;
    
    -- Return the new balance value (don't update in this function since we're using it in an update statement)
    RETURN current_balance + amount;
END;
$$ LANGUAGE plpgsql; 