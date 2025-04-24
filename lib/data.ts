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
    winnerId: data.winner_id?.toString()
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
    winnerId: data.winner_id?.toString()
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

export async function updateRaceStatus(raceId: string, status: "upcoming" | "open" | "settled"): Promise<Race | null> {
  const parsedRaceId = safeParseInt(raceId);
  if (parsedRaceId === null) {
    console.error('Invalid race ID format:', raceId);
    return null;
  }

  const updateData: any = { status }
  
  if (status === 'settled') {
    updateData.settled_at = new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('races')
    .update(updateData)
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
    winnerId: data.winner_id?.toString()
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
    winnerId: data.winner_id?.toString()
  }
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
  // Get race and winning player
  const { data: raceData, error: raceError } = await supabase
    .from('races')
    .select('*, winner_id')
    .eq('id', parseInt(raceId, 10))
    .single()
    
  if (raceError || !raceData || !raceData.winner_id) {
    console.error('Error fetching race:', raceError)
    throw new Error("Race cannot be settled without a winner")
  }
  
  const { data: winningPlayerData, error: playerError } = await supabase
    .from('players')
    .select('odds')
    .eq('id', raceData.winner_id)
    .single()
    
  if (playerError || !winningPlayerData) {
    console.error('Error fetching winning player:', playerError)
    throw new Error("Winning player not found")
  }
  
  // Update race status
  const { data: updatedRaceData, error: updateRaceError } = await supabase
    .from('races')
    .update({ 
      status: 'settled',
      settled_at: new Date().toISOString()
    })
    .eq('id', parseInt(raceId, 10))
    .select()
    .single()
    
  if (updateRaceError || !updatedRaceData) {
    console.error('Error updating race status:', updateRaceError)
    return null
  }
  
  // Get all unsettled bets for this race
  const { data: betsData, error: betsError } = await supabase
    .from('bets')
    .select('*')
    .eq('race_id', parseInt(raceId, 10))
    .eq('settled', false)
    
  if (betsError) {
    console.error('Error fetching bets:', betsError)
    return null
  }
  
  // Process each bet
  for (const bet of betsData) {
    let winnings = 0
    
    if (bet.player_id === raceData.winner_id) {
      winnings = bet.amount * winningPlayerData.odds
      
      // Update user balance
      await supabase
        .from('users')
        .update({ 
          balance: supabase.rpc('increment_balance', { 
            row_id: parseInt(bet.user_id.toString(), 10),
            amount: winnings
          })
        })
        .eq('id', parseInt(bet.user_id.toString(), 10))
    }
    
    // Mark bet as settled
    await supabase
      .from('bets')
      .update({ 
        settled: true,
        winnings
      })
      .eq('id', bet.id)
  }
  
  return {
    id: updatedRaceData.id.toString(),
    name: updatedRaceData.name,
    status: updatedRaceData.status,
    createdAt: updatedRaceData.created_at,
    settledAt: updatedRaceData.settled_at,
    winnerId: updatedRaceData.winner_id?.toString()
  }
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
  // Check if the race has any unsettled bets
  const { data: unsettledBetsData, error: betsError } = await supabase
    .from('bets')
    .select('*')
    .eq('race_id', parseInt(raceId, 10))
    .eq('settled', false)
    
  if (betsError) {
    console.error('Error checking for unsettled bets:', betsError)
    throw new Error("Failed to check for unsettled bets")
  }
  
  // If there are unsettled bets, refund them
  for (const bet of unsettledBetsData) {
    // Update user balance
    await supabase
      .from('users')
      .update({ 
        balance: supabase.rpc('increment_balance', { 
          row_id: parseInt(bet.user_id.toString(), 10),
          amount: bet.amount
        })
      })
      .eq('id', parseInt(bet.user_id.toString(), 10))
      
    // Mark bet as settled
    await supabase
      .from('bets')
      .update({ settled: true, winnings: 0 })
      .eq('id', bet.id)
  }
  
  // Delete the race (this should cascade to delete related players due to the foreign key constraints)
  const { error: deleteError } = await supabase
    .from('races')
    .delete()
    .eq('id', parseInt(raceId, 10))
    
  if (deleteError) {
    console.error('Error deleting race:', deleteError)
    return false
  }
  
  return true
}
