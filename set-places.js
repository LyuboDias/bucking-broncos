// Script to set winner and places for a race
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

async function getPlayersForRace(raceId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('race_id', parseInt(raceId, 10));
    
  if (error) {
    console.error('Error fetching players:', error);
    return [];
  }
  
  return data;
}

async function setPlaces(raceId) {
  // Get players for the race
  const players = await getPlayersForRace(raceId);
  
  if (players.length < 2) {
    console.error('Not enough players in the race to set places');
    return;
  }
  
  console.log("Available players:");
  players.forEach((player, idx) => {
    console.log(`${idx+1}. ID: ${player.id}, Name: ${player.name}, Odds: ${player.odds}`);
  });
  
  // Set first place (winner) - using first player
  const winnerId = players[0].id;
  
  // Set second place - using second player
  const secondPlaceId = players[1].id;
  
  // Set third place if available - using third player
  const thirdPlaceId = players.length > 2 ? players[2].id : null;
  
  console.log(`Setting 1st place to: ${players[0].name} (ID: ${winnerId})`);
  console.log(`Setting 2nd place to: ${players[1].name} (ID: ${secondPlaceId})`);
  if (thirdPlaceId) {
    console.log(`Setting 3rd place to: ${players[2].name} (ID: ${thirdPlaceId})`);
  }
  
  // Update the race with the places
  const { data, error } = await supabase
    .from('races')
    .update({ 
      winner_id: winnerId,
      second_place_id: secondPlaceId,
      third_place_id: thirdPlaceId
    })
    .eq('id', parseInt(raceId, 10))
    .select()
    .single();
    
  if (error) {
    console.error('Error setting places:', error);
    return;
  }
  
  console.log("Places set successfully!");
  console.log("Updated race data:", data);
}

// Get race ID from command line
const raceId = process.argv[2];
if (!raceId) {
  console.error('Please provide a race ID as a command line argument');
  process.exit(1);
}

setPlaces(raceId).catch(console.error); 