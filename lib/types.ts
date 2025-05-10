export type Race = {
  id: string
  name: string
  status: "upcoming" | "open" | "settled"
  createdAt: string
  settledAt?: string
  winnerId?: string
  secondPlaceId?: string
  thirdPlaceId?: string
}

export type Player = {
  id: string
  raceId: string
  name: string
  odds: number
}

export type Bet = {
  id: string
  userId: string
  raceId: string
  playerId: string
  amount: number
  createdAt: string
  settled: boolean
  winnings: number
  placeRank?: number // 1 for first, 2 for second, 3 for third place
}

export type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  balance: number
}
