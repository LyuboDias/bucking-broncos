import type { Race, Player, Bet, User } from "./types"

// Mock data store
const races: Race[] = [
  {
    id: "race1",
    name: "FDJ C&M TEM Race",
    status: "open", // Changed from "upcoming" to "open"
    createdAt: new Date().toISOString(),
  },
]

const players: Player[] = [
  { id: "player1", raceId: "race1", name: "Ross", odds: 6.7 },
  { id: "player2", raceId: "race1", name: "Banu", odds: 12.2 },
  { id: "player3", raceId: "race1", name: "Neil H", odds: 3.4 },
  { id: "player4", raceId: "race1", name: "Aaron", odds: 1.7 },
  { id: "player5", raceId: "race1", name: "Aneta", odds: 7.7 },
]

// Clear existing bets
const bets: Bet[] = []

const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    isAdmin: true,
    balance: 1000,
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    isAdmin: false,
    balance: 100,
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    isAdmin: false,
    balance: 100,
  },
  {
    id: "4",
    name: "Bob Johnson",
    email: "bob@example.com",
    isAdmin: false,
    balance: 100,
  },
  {
    id: "5",
    name: 'Ross "Yellow" Jacobs',
    email: "ross@example.com",
    isAdmin: false,
    balance: 100,
  },
  {
    id: "6",
    name: "Lyu Dias",
    email: "lyu@example.com",
    isAdmin: false,
    balance: 100,
  },
  {
    id: "7",
    name: "Aaron Bird",
    email: "aaron@example.com",
    isAdmin: false,
    balance: 100,
  },
]

// Data access functions
export async function getRaces() {
  return [...races] // Return a copy to avoid unintended mutations
}

export async function getRace(id: string) {
  return races.find((race) => race.id === id) || null
}

export async function getPlayersForRace(raceId: string) {
  return players.filter((player) => player.raceId === raceId)
}

export async function getBetsForRace(raceId: string) {
  return bets.filter((bet) => bet.raceId === raceId)
}

export async function getUserBetsForRace(userId: string, raceId: string) {
  return bets.filter((bet) => bet.userId === userId && bet.raceId === raceId)
}

export async function getUsers() {
  return users
}

export async function getUser(id: string) {
  return users.find((user) => user.id === id) || null
}

export async function getUserByEmail(email: string) {
  return users.find((user) => user.email === email) || null
}

export async function createRace(name: string) {
  // Generate a more reliable ID that doesn't depend on array length
  // Use timestamp + random string to ensure uniqueness
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 5)
  const newId = `race-${timestamp}-${randomStr}`

  const newRace: Race = {
    id: newId,
    name,
    status: "upcoming",
    createdAt: new Date().toISOString(),
  }
  races.push(newRace)
  return newRace
}

export async function addPlayerToRace(raceId: string, name: string, odds: number) {
  const newPlayer: Player = {
    id: `player${players.length + 1}`,
    raceId,
    name,
    odds,
  }
  players.push(newPlayer)
  return newPlayer
}

export async function updateRaceStatus(raceId: string, status: "upcoming" | "open" | "settled") {
  const race = races.find((r) => r.id === raceId)
  if (race) {
    race.status = status
    if (status === "settled") {
      race.settledAt = new Date().toISOString()
    }
    return race
  }
  return null
}

export async function setRaceWinner(raceId: string, playerId: string) {
  const race = races.find((r) => r.id === raceId)
  if (race) {
    race.winnerId = playerId
    return race
  }
  return null
}

export async function placeBet(userId: string, raceId: string, playerId: string, amount: number) {
  const user = users.find((u) => u.id === userId)
  if (!user || user.balance < amount) {
    throw new Error("Insufficient balance")
  }

  const race = races.find((r) => r.id === raceId)
  if (!race || race.status !== "open") {
    throw new Error("Race is not open for betting")
  }

  // Update user balance
  user.balance -= amount

  const newBet: Bet = {
    id: `bet${bets.length + 1}`,
    userId,
    raceId,
    playerId,
    amount,
    createdAt: new Date().toISOString(),
    settled: false,
    winnings: 0,
  }
  bets.push(newBet)
  return newBet
}

export async function settleRace(raceId: string) {
  const race = races.find((r) => r.id === raceId)
  if (!race || !race.winnerId) {
    throw new Error("Race cannot be settled without a winner")
  }

  const winningPlayer = players.find((p) => p.id === race.winnerId)
  if (!winningPlayer) {
    throw new Error("Winning player not found")
  }

  // Update race status
  race.status = "settled"
  race.settledAt = new Date().toISOString()

  // Settle all bets for this race
  const raceBets = bets.filter((b) => b.raceId === raceId && !b.settled)

  for (const bet of raceBets) {
    bet.settled = true

    if (bet.playerId === race.winnerId) {
      // Calculate winnings
      bet.winnings = bet.amount * winningPlayer.odds

      // Update user balance
      const user = users.find((u) => u.id === bet.userId)
      if (user) {
        user.balance += bet.winnings
      }
    } else {
      bet.winnings = 0
    }
  }

  return race
}

export async function createUser(name: string, email: string, isAdmin = false) {
  const newUser: User = {
    id: `${users.length + 1}`,
    name,
    email,
    isAdmin,
    balance: 100, // Initial balance for new users
  }
  users.push(newUser)
  return newUser
}

export async function updateUserBalance(userId: string, newBalance: number) {
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.balance = newBalance
    return user
  }
  return null
}

export async function deleteRace(raceId: string) {
  // Find the race index
  const raceIndex = races.findIndex((r) => r.id === raceId)

  if (raceIndex === -1) {
    throw new Error("Race not found")
  }

  // Check if the race has unsettled bets
  const unsettledBets = bets.filter((b) => b.raceId === raceId && !b.settled)

  if (unsettledBets.length > 0) {
    // Refund all unsettled bets
    for (const bet of unsettledBets) {
      const user = users.find((u) => u.id === bet.userId)
      if (user) {
        user.balance += bet.amount
      }
      bet.settled = true
      bet.winnings = 0
    }
  }

  // Remove the race
  races.splice(raceIndex, 1)

  // Remove all players for this race
  const playerIndices = players
    .map((p, index) => (p.raceId === raceId ? index : -1))
    .filter((index) => index !== -1)
    .sort((a, b) => b - a) // Sort in descending order to remove from end first

  for (const index of playerIndices) {
    players.splice(index, 1)
  }

  return true
}
