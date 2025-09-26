import type { Race, Player, Bet, User } from "./types"
import { supabase } from './supabase'

/**
 * Safely convert string ID to integer
 * If the ID is not a valid number, return null
 */
function safeParseInt(id: string | undefined | null): number | null {
  if (!id) return null;
  
  // Check if the ID is numeric before parsing
  if (!/^\d+$/.test(id)) {
    console.warn(`Invalid ID format: "${id}" is not a valid integer`);
    return null;
  }
  
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

// Data access functions for races
export async function getRaces(): Promise<Race[]> {
  const { data, error } = await supabase
    .from('races')
    .select('*')
    
  if (error) {
    console.error('Error fetching races:', error)
    return []
  }
  
  return data.map(race => ({
    ...race,
    id: race.id.toString(),
    createdAt: race.created_at,
    settledAt: race.settled_at,
    winnerId: race.winner_id?.toString()
  }))
}

export async function getRace(id: string): Promise<Race | null> {
  const parsedId = safeParseInt(id);
  if (parsedId === null) {
    console.error('Invalid race ID format:', id);
    return null;
  }

  const { data, error } = await supabase
    .from('races')
    .select('*')
    .eq('id', parsedId)
    .single()
    
  if (error || !data) {
    console.error('Error fetching race:', error)
    return null
  }
  
  return {
    ...data,
    id: data.id.toString(),
    createdAt: data.created_at,
    settledAt: data.settled_at,
    winnerId: data.winner_id?.toString(),
    secondPlaceId: data.second_place_id?.toString(),
    thirdPlaceId: data.third_place_id?.toString()
  }
}

// Data access functions for players
export async function getPlayersForRace(raceId: string): Promise<Player[]> {
  const parsedId = safeParseInt(raceId);
  if (parsedId === null) {
    console.error('Invalid race ID format:', raceId);
    return [];
  }

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('race_id', parsedId)
    
  if (error) {
    console.error('Error fetching players:', error)
    return []
  }
  
  return data.map(player => ({
    id: player.id.toString(),
    raceId: player.race_id.toString(),
    name: player.name,
    odds: player.odds
  }))
}

// Data access functions for bets
export async function getBetsForRace(raceId: string): Promise<Bet[]> {
  const parsedId = safeParseInt(raceId);
  if (parsedId === null) {
    console.error('Invalid race ID format:', raceId);
    return [];
  }

  const { data, error } = await supabase
    .from('bets')
    .select('*')
    .eq('race_id', parsedId)
    
  if (error) {
    console.error('Error fetching bets:', error)
    return []
  }
  
  return data.map(bet => ({
    id: bet.id.toString(),
    userId: bet.user_id.toString(),
    raceId: bet.race_id.toString(),
    playerId: bet.player_id.toString(),
    amount: bet.amount,
    createdAt: bet.created_at,
    settled: bet.settled,
    winnings: bet.winnings
  }))
}

export async function getUserBetsForRace(userId: string, raceId: string): Promise<Bet[]> {
  const parsedUserId = safeParseInt(userId);
  const parsedRaceId = safeParseInt(raceId);
  
  if (parsedUserId === null) {
    console.error('Invalid user ID format:', userId);
    return [];
  }
  
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    return [];
  }

  const { data, error } = await supabase
    .from('bets')
    .select('*')
    .eq('user_id', parsedUserId)
    .eq('race_id', parsedRaceId)
    
  if (error) {
    console.error('Error fetching user bets:', error)
    return []
  }
  
  return data.map(bet => ({
    id: bet.id.toString(),
    userId: bet.user_id.toString(),
    raceId: bet.race_id.toString(),
    playerId: bet.player_id.toString(),
    amount: bet.amount,
    createdAt: bet.created_at,
    settled: bet.settled,
    winnings: bet.winnings
  }))
}

// Data access functions for users
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    
  if (error) {
    console.error('Error fetching users:', error)
    return []
  }
  
  return data.map(user => ({
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    isAdmin: user.is_admin,
    balance: user.balance
  }))
}

export async function getUser(id: string): Promise<User | null> {
  const parsedId = safeParseInt(id);
  if (parsedId === null) {
    console.error('Invalid user ID format:', id);
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', parsedId)
    .single()
    
  if (error || !data) {
    console.error('Error fetching user:', error)
    return null
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    email: data.email,
    isAdmin: data.is_admin,
    balance: data.balance
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
    
  if (error || !data) {
    console.error('Error fetching user by email:', error)
    return null
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    email: data.email,
    isAdmin: data.is_admin,
    balance: data.balance
  }
}

export async function createRace(name: string): Promise<Race | null> {
  const { data, error } = await supabase
    .from('races')
    .insert([{
      name,
      status: 'upcoming',
      created_at: new Date().toISOString()
    }])
    .select()
    .single()
    
  if (error || !data) {
    console.error('Error creating race:', error)
    return null
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    status: data.status,
    createdAt: data.created_at,
    settledAt: data.settled_at,
    winnerId: data.winner_id?.toString(),
    secondPlaceId: data.second_place_id?.toString(),
    thirdPlaceId: data.third_place_id?.toString()
  }
}

export async function addPlayerToRace(raceId: string, name: string, odds: number): Promise<Player | null> {
  const parsedRaceId = safeParseInt(raceId);
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    return null;
  }

  const { data, error } = await supabase
    .from('players')
    .insert([{
      race_id: parsedRaceId,
      name,
      odds
    }])
    .select()
    .single()
    
  if (error || !data) {
    console.error('Error adding player:', error)
    return null
  }
  
  return {
    id: data.id.toString(),
    raceId: data.race_id.toString(),
    name: data.name,
    odds: data.odds
  }
}

export async function updateRaceStatus(raceId: string, status: "upcoming" | "open" | "closed" | "settled"): Promise<Race | null> {
  const parsedRaceId = safeParseInt(raceId);
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    return null;
  }

  const { data, error } = await supabase
    .from('races')
    .update({ status })
    .eq('id', parsedRaceId)
    .select()
    .single()
    
  if (error || !data) {
    console.error('Error updating race status:', error)
    return null
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    status: data.status,
    createdAt: data.created_at,
    settledAt: data.settled_at,
    winnerId: data.winner_id?.toString(),
    secondPlaceId: data.second_place_id?.toString(),
    thirdPlaceId: data.third_place_id?.toString()
  }
}

export async function setRaceWinner(raceId: string, playerId: string): Promise<Race | null> {
  const parsedRaceId = safeParseInt(raceId);
  const parsedPlayerId = safeParseInt(playerId);
  
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    return null;
  }
  
  if (parsedPlayerId === null) {
    console.error('Invalid player ID format:', playerId);
    return null;
  }

  const { data, error } = await supabase
    .from('races')
    .update({ winner_id: parsedPlayerId })
    .eq('id', parsedRaceId)
    .select()
    .single()
    
  if (error || !data) {
    console.error('Error setting race winner:', error)
    return null
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    status: data.status,
    createdAt: data.created_at,
    settledAt: data.settled_at,
    winnerId: data.winner_id?.toString(),
    secondPlaceId: data.second_place_id?.toString(),
    thirdPlaceId: data.third_place_id?.toString()
  }
}

export async function setRaceSecondPlace(raceId: string, playerId: string): Promise<Race | null> {
  const parsedRaceId = safeParseInt(raceId);
  const parsedPlayerId = safeParseInt(playerId);
  
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    return null;
  }
  
  if (parsedPlayerId === null) {
    console.error('Invalid player ID format:', playerId);
    return null;
  }

  // Ensure we're not setting the same player for multiple places
  const { data: raceData } = await supabase
    .from('races')
    .select('winner_id')
    .eq('id', parsedRaceId)
    .single();
    
  if (raceData && raceData.winner_id === parsedPlayerId) {
    throw new Error("Cannot set the same player for both first and second place");
  }

  const { data, error } = await supabase
    .from('races')
    .update({ second_place_id: parsedPlayerId })
    .eq('id', parsedRaceId)
    .select()
    .single();
    
  if (error || !data) {
    console.error('Error setting race second place:', error);
    return null;
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    status: data.status,
    createdAt: data.created_at,
    settledAt: data.settled_at,
    winnerId: data.winner_id?.toString(),
    secondPlaceId: data.second_place_id?.toString(),
    thirdPlaceId: data.third_place_id?.toString()
  };
}

export async function setRaceThirdPlace(raceId: string, playerId: string): Promise<Race | null> {
  const parsedRaceId = safeParseInt(raceId);
  const parsedPlayerId = safeParseInt(playerId);
  
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    return null;
  }
  
  if (parsedPlayerId === null) {
    console.error('Invalid player ID format:', playerId);
    return null;
  }

  // Ensure we're not setting the same player for multiple places
  const { data: raceData } = await supabase
    .from('races')
    .select('winner_id, second_place_id')
    .eq('id', parsedRaceId)
    .single();
    
  if (raceData) {
    if (raceData.winner_id === parsedPlayerId) {
      throw new Error("Cannot set the same player for both first and third place");
    }
    if (raceData.second_place_id === parsedPlayerId) {
      throw new Error("Cannot set the same player for both second and third place");
    }
  }

  const { data, error } = await supabase
    .from('races')
    .update({ third_place_id: parsedPlayerId })
    .eq('id', parsedRaceId)
    .select()
    .single();
    
  if (error || !data) {
    console.error('Error setting race third place:', error);
    return null;
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    status: data.status,
    createdAt: data.created_at,
    settledAt: data.settled_at,
    winnerId: data.winner_id?.toString(),
    secondPlaceId: data.second_place_id?.toString(),
    thirdPlaceId: data.third_place_id?.toString()
  };
}

export async function placeBet(userId: string, raceId: string, playerId: string, amount: number): Promise<Bet | null> {
  const parsedUserId = safeParseInt(userId);
  const parsedRaceId = safeParseInt(raceId);
  const parsedPlayerId = safeParseInt(playerId);
  
  if (parsedUserId === null) {
    console.error('Invalid user ID format:', userId);
    throw new Error("Invalid user ID");
  }
  
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    throw new Error("Invalid race ID");
  }
  
  if (parsedPlayerId === null) {
    console.error('Invalid player ID format:', playerId);
    throw new Error("Invalid player ID");
  }

  // Start a transaction using Supabase
  // First, check user balance
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('balance')
    .eq('id', parsedUserId)
    .single()
    
  if (userError || !userData) {
    console.error('Error fetching user balance:', userError)
    throw new Error("User not found")
  }
  
  if (userData.balance < amount) {
    throw new Error("Insufficient balance")
  }
  
  // Check race status
  const { data: raceData, error: raceError } = await supabase
    .from('races')
    .select('status')
    .eq('id', parsedRaceId)
    .single()
    
  if (raceError || !raceData) {
    console.error('Error fetching race status:', raceError)
    throw new Error("Race not found")
  }
  
  if (raceData.status !== "open") {
    throw new Error("Race is not open for betting")
  }
  
  // Update user balance
  const { error: updateBalanceError } = await supabase
    .from('users')
    .update({ balance: userData.balance - amount })
    .eq('id', parsedUserId)
    
  if (updateBalanceError) {
    console.error('Error updating user balance:', updateBalanceError)
    throw new Error("Failed to update balance")
  }
  
  // Create bet
  const { data: betData, error: betError } = await supabase
    .from('bets')
    .insert([{
      user_id: parsedUserId,
      race_id: parsedRaceId,
      player_id: parsedPlayerId,
      amount,
      created_at: new Date().toISOString(),
      settled: false,
      winnings: 0
    }])
    .select()
    .single()
    
  if (betError || !betData) {
    // Attempt to rollback by refunding the user
    await supabase
      .from('users')
      .update({ balance: userData.balance })
      .eq('id', parsedUserId)
      
    console.error('Error creating bet:', betError)
    throw new Error("Failed to create bet")
  }
  
  return {
    id: betData.id.toString(),
    userId: betData.user_id.toString(),
    raceId: betData.race_id.toString(),
    playerId: betData.player_id.toString(),
    amount: betData.amount,
    createdAt: betData.created_at,
    settled: betData.settled,
    winnings: betData.winnings
  }
}

export async function settleRace(raceId: string): Promise<Race | null> {
  // Get race and winning players
  const { data: raceData, error: raceError } = await supabase
    .from('races')
    .select('*, winner_id, second_place_id, third_place_id')
    .eq('id', parseInt(raceId, 10))
    .single();
    
  if (raceError || !raceData || !raceData.winner_id || !raceData.second_place_id) {
    console.error('Error fetching race:', raceError);
    throw new Error("Race cannot be settled without a winner and second place");
  }
  
  // Get odds for all placed players
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
    throw new Error("Could not fetch player odds");
  }
  
  const playerOdds = Object.fromEntries(
    playersData.map(player => [player.id, player.odds])
  );
  
  // Update race status
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
    return null;
  }
  
  // Get all unsettled bets for this race
  const { data: betsData, error: betsError } = await supabase
    .from('bets')
    .select('*')
    .eq('race_id', parseInt(raceId, 10))
    .eq('settled', false);
    
  if (betsError) {
    console.error('Error fetching bets:', betsError);
    return null;
  }
  
  // Process each bet
  for (const bet of betsData) {
    let winnings = 0;
    let placeRank = null;
    
    if (bet.player_id === raceData.winner_id) {
      // First place gets full odds
      winnings = bet.amount * playerOdds[bet.player_id];
      placeRank = 1;
    } 
    else if (bet.player_id === raceData.second_place_id) {
      // Second place gets half odds
      winnings = bet.amount * (playerOdds[bet.player_id] / 2);
      placeRank = 2;
    } 
    else if (raceData.third_place_id && bet.player_id === raceData.third_place_id) {
      // Third place gets half odds (if third place was set)
      winnings = bet.amount * (playerOdds[bet.player_id] / 2);
      placeRank = 3;
    }
    
    if (winnings > 0) {
      // First get the current user balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', parseInt(bet.user_id.toString(), 10))
        .single();
        
      if (userError || !userData) {
        console.error('Error fetching user balance:', userError);
        continue; // Skip to next bet if user not found
      }
      
      // Then update user balance for winning bets
      await supabase
        .from('users')
        .update({ 
          balance: userData.balance + winnings 
        })
        .eq('id', parseInt(bet.user_id.toString(), 10));
        
      console.log(`Updated balance for user ${bet.user_id} - added ${winnings} coins`);
    }
    
    // Mark bet as settled
    await supabase
      .from('bets')
      .update({ 
        settled: true,
        winnings,
        place_rank: placeRank
      })
      .eq('id', bet.id);
      
    console.log(`Settled bet ${bet.id} with winnings: ${winnings}`);
  }
  
  return {
    id: updatedRaceData.id.toString(),
    name: updatedRaceData.name,
    status: updatedRaceData.status,
    createdAt: updatedRaceData.created_at,
    settledAt: updatedRaceData.settled_at,
    winnerId: updatedRaceData.winner_id?.toString(),
    secondPlaceId: updatedRaceData.second_place_id?.toString(),
    thirdPlaceId: updatedRaceData.third_place_id?.toString()
  };
}

export async function createUser(name: string, email: string, isAdmin = false): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      name,
      email,
      is_admin: isAdmin,
      balance: 100 // Initial balance for new users
    }])
    .select()
    .single()
    
  if (error || !data) {
    console.error('Error creating user:', error)
    return null
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    email: data.email,
    isAdmin: data.is_admin,
    balance: data.balance
  }
}

export async function updateUserBalance(userId: string, newBalance: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update({ balance: newBalance })
    .eq('id', parseInt(userId, 10))
    .select()
    .single()
    
  if (error || !data) {
    console.error('Error updating user balance:', error)
    return null
  }
  
  return {
    id: data.id.toString(),
    name: data.name,
    email: data.email,
    isAdmin: data.is_admin,
    balance: data.balance
  }
}

export async function deleteRace(raceId: string): Promise<boolean> {
  // Parse race ID
  const parsedRaceId = safeParseInt(raceId);
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    throw new Error("Invalid race ID format");
  }

  try {
    // Start a transaction using supabase
    // First, fetch all bets related to this race
    const { data: betsData, error: betsError } = await supabase
      .from('bets')
      .select('*')
      .eq('race_id', parsedRaceId);
      
    if (betsError) {
      console.error('Error fetching bets for race:', betsError);
      throw new Error("Failed to fetch bets for race");
    }
    
    // Process each bet - refund unsettled bets
    for (const bet of betsData) {
      if (!bet.settled) {
        // Get current user balance
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('balance')
          .eq('id', bet.user_id)
          .single();
          
        if (userError || !userData) {
          console.error('Error fetching user balance:', userError);
          continue; // Skip to next bet if user not found
        }
        
        // Update user balance with refund
        await supabase
          .from('users')
          .update({ 
            balance: userData.balance + bet.amount
          })
          .eq('id', bet.user_id);
          
        console.log(`Refunded ${bet.amount} coins to user ${bet.user_id} for canceled bet`);
      }
    }
    
    // 1. Delete all bets related to this race
    const { error: deleteBetsError } = await supabase
      .from('bets')
      .delete()
      .eq('race_id', parsedRaceId);
      
    if (deleteBetsError) {
      console.error('Error deleting bets for race:', deleteBetsError);
      throw new Error("Failed to delete bets for race");
    }
    
    console.log(`Deleted all bets for race ${raceId}`);

    // 2. Remove references to players in the race (winner, second place, third place)
    const { error: clearReferencesError } = await supabase
      .from('races')
      .update({
        winner_id: null,
        second_place_id: null,
        third_place_id: null
      })
      .eq('id', parsedRaceId);
      
    if (clearReferencesError) {
      console.error('Error clearing player references:', clearReferencesError);
      throw new Error("Failed to clear player references");
    }
    
    console.log(`Cleared player references for race ${raceId}`);
    
    // 3. Delete all players related to this race
    const { error: deletePlayersError } = await supabase
      .from('players')
      .delete()
      .eq('race_id', parsedRaceId);
      
    if (deletePlayersError) {
      console.error('Error deleting players for race:', deletePlayersError);
      throw new Error("Failed to delete players for race");
    }
    
    console.log(`Deleted all players for race ${raceId}`);
    
    // 4. Finally delete the race itself
    const { error: deleteRaceError } = await supabase
      .from('races')
      .delete()
      .eq('id', parsedRaceId);
      
    if (deleteRaceError) {
      console.error('Error deleting race:', deleteRaceError);
      throw new Error("Failed to delete race");
    }
    
    console.log(`Successfully deleted race ${raceId}`);
    return true;
  } catch (error) {
    console.error('Error in delete race transaction:', error);
    throw error;
  }
}
