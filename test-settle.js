// Simple script to test the settleRace function
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=').map(part => part.trim()))
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables in .env.local file');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSettleRace(raceId) {
  console.log(`Testing settlement for race ID: ${raceId}`);
  
  // Get race data
  const { data: raceData, error: raceError } = await supabase
    .from('races')
    .select('*, winner_id, second_place_id, third_place_id')
    .eq('id', parseInt(raceId, 10))
    .single();
    
  if (raceError || !raceData) {
    console.error('Error fetching race:', raceError);
    return;
  }
  
  console.log("Race data:", raceData);
  
  if (!raceData.winner_id || !raceData.second_place_id) {
    console.error("Race cannot be settled without a winner and second place");
    return;
  }
  
  // Get player odds
  const playerIds = [
    raceData.winner_id, 
    raceData.second_place_id, 
    raceData.third_place_id
  ].filter(Boolean);  // Remove null values
  
  const { data: playersData, error: playersError } = await supabase
    .from('players')
    .select('id, odds')
    .in('id', playerIds);
    
  if (playersError || !playersData) {
    console.error('Error fetching players:', playersError);
    return;
  }
  
  console.log("Players data:", playersData);
  
  // Change race status to settled
  const { data: updatedRaceData, error: updateRaceError } = await supabase
    .from('races')
    .update({ 
      status: 'settled'
    })
    .eq('id', parseInt(raceId, 10))
    .select()
    .single();
    
  if (updateRaceError || !updatedRaceData) {
    console.error('Error updating race status:', updateRaceError);
    return;
  }
  
  console.log("Updated race data:", updatedRaceData);
  
  // Get all unsettled bets for this race
  const { data: betsData, error: betsError } = await supabase
    .from('bets')
    .select('*')
    .eq('race_id', parseInt(raceId, 10))
    .eq('settled', false);
    
  if (betsError) {
    console.error('Error fetching bets:', betsError);
    return;
  }
  
  console.log(`Found ${betsData.length} unsettled bets`);
  
  const playerOdds = {};
  playersData.forEach(player => {
    playerOdds[player.id] = player.odds;
  });
  
  // Process each bet
  for (const bet of betsData) {
    console.log(`Processing bet ${bet.id} for player ${bet.player_id}`);
    
    let winnings = 0;
    let placeRank = null;
    
    if (bet.player_id === raceData.winner_id) {
      // First place gets full odds
      winnings = bet.amount * playerOdds[bet.player_id];
      placeRank = 1;
      console.log(`Winner bet: ${bet.amount} * ${playerOdds[bet.player_id]} = ${winnings}`);
    } 
    else if (bet.player_id === raceData.second_place_id) {
      // Second place gets half odds
      winnings = bet.amount * (playerOdds[bet.player_id] / 2);
      placeRank = 2;
      console.log(`Second place bet: ${bet.amount} * (${playerOdds[bet.player_id]} / 2) = ${winnings}`);
    } 
    else if (raceData.third_place_id && bet.player_id === raceData.third_place_id) {
      // Third place gets half odds (if third place was set)
      winnings = bet.amount * (playerOdds[bet.player_id] / 2);
      placeRank = 3;
      console.log(`Third place bet: ${bet.amount} * (${playerOdds[bet.player_id]} / 2) = ${winnings}`);
    } else {
      console.log(`Bet on player ${bet.player_id} did not win`);
    }
    
    if (winnings > 0) {
      // Get user balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', parseInt(bet.user_id, 10))
        .single();
        
      if (userError || !userData) {
        console.error(`Error fetching user ${bet.user_id} balance:`, userError);
        continue;
      }
      
      console.log(`User ${bet.user_id} current balance: ${userData.balance}`);
      const newBalance = userData.balance + winnings;
      
      // Update user balance with winnings
      const { data: updatedUser, error: updateUserError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', parseInt(bet.user_id, 10))
        .select()
        .single();
        
      if (updateUserError) {
        console.error(`Error updating user ${bet.user_id} balance:`, updateUserError);
      } else {
        console.log(`Updated user ${bet.user_id} balance to ${updatedUser.balance}`);
      }
    }
    
    // Mark bet as settled regardless of winnings
    const { data: updatedBet, error: updateBetError } = await supabase
      .from('bets')
      .update({ 
        settled: true,
        winnings,
        place_rank: placeRank
      })
      .eq('id', bet.id)
      .select()
      .single();
      
    if (updateBetError) {
      console.error(`Error marking bet ${bet.id} as settled:`, updateBetError);
    } else {
      console.log(`Bet ${bet.id} marked as settled with winnings ${updatedBet.winnings}`);
    }
  }
  
  console.log("Settlement completed.");
}

// Get race ID from command line
const raceId = process.argv[2];
if (!raceId) {
  console.error('Please provide a race ID as a command line argument');
  process.exit(1);
}

testSettleRace(raceId).catch(console.error); 