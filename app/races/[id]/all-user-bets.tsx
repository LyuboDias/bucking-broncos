"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Bet, Player } from "@/lib/types"
import { getUser } from "@/lib/data"
import { ORANGE, GREY } from "@/app/constants"

type BetWithDetails = Bet & {
  userName: string
  playerName: string
  odds: number
}

export default function AllUserBets({
  bets,
  players,
  userId,
}: {
  bets: Bet[]
  players: Player[]
  userId?: string
}) {
  const [betsWithDetails, setBetsWithDetails] = useState<BetWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserBets() {
      try {
        console.log("AllUserBets - userId:", userId);
        console.log("AllUserBets - total bets from server:", bets.length);
        
        // Ensure userId is a string before comparison
        const userIdStr = userId ? String(userId) : undefined;
        
        // Filter server bets for the specified user if a userId is provided
        const filteredBets = userIdStr
          ? bets.filter(bet => {
              // Ensure bet.userId is a string for comparison
              const betUserId = String(bet.userId);
              return betUserId === userIdStr;
            })
          : bets;
           
        console.log("AllUserBets - total filtered bets:", filteredBets.length);

        // If no bets after filtering, mark as loaded with empty array
        if (filteredBets.length === 0) {
          setBetsWithDetails([])
          setLoading(false)
          return
        }

        // Fetch user data for all bets
        const userPromises = filteredBets.map(async (bet) => {
          const user = await getUser(bet.userId)
          const player = players.find(p => p.id === bet.playerId)
          return {
            ...bet,
            userName: user?.name || `User #${bet.userId}`,
            playerName: player?.name || 'Unknown Player',
            odds: player?.odds || 0
          }
        })

        const result = await Promise.all(userPromises)
        console.log("AllUserBets - bets with details:", result.length);
        setBetsWithDetails(result)
        setLoading(false)
      } catch (error) {
        console.error("Error loading user bets:", error)
        setLoading(false)
      }
    }

    loadUserBets()
  }, [bets, players, userId])

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{userId ? "Your Bets" : "All Bets"}</CardTitle>
          <CardDescription>{userId ? "Loading your bets..." : "Loading all bets..."}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-4">Loading bet information...</div>
        </CardContent>
      </Card>
    )
  }

  // If no bets after filtering, show a message
  if (betsWithDetails.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{ color: ORANGE }}>{userId ? "Your Bets" : "All Bets"}</CardTitle>
          <CardDescription style={{ color: GREY }}>{userId ? "You haven't placed any bets on this race yet" : "No bets have been placed on this race yet"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4" style={{ color: GREY }}>No bets have been placed on this race yet</div>
        </CardContent>
      </Card>
    )
  }

  // Group bets by user
  const betsByUser = betsWithDetails.reduce((acc, bet) => {
    if (!acc[bet.userId]) {
      acc[bet.userId] = {
        userName: bet.userName,
        bets: []
      }
    }
    acc[bet.userId].bets.push(bet)
    return acc
  }, {} as Record<string, {userName: string, bets: typeof betsWithDetails}>)

  // Change the title based on whether we're showing all bets or just one user's bets
  const title = userId ? "Your Bets" : "All Bets"
  const description = userId ? "Bets you've placed on this race" : "All bets placed on this race"

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle style={{ color: ORANGE }}>{title}</CardTitle>
        <CardDescription style={{ color: GREY }}>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(betsByUser).map(([betUserId, userData]) => (
            <div key={betUserId} className="space-y-2">
              {!userId && <h3 className="font-semibold text-md">{userData.userName}</h3>}
              <div className="space-y-2 pl-4">
                {userData.bets.map((bet) => (
                  <div key={bet.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium" style={{ color: "#000" }}>{bet.playerName}</div>
                      <div className="text-sm" style={{ color: "#000" }}>
                        {bet.odds}x odds
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: ORANGE }}>{bet.amount} coins</div>
                      {bet.settled && (
                        <div className={`text-sm ${bet.winnings > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {bet.winnings > 0 ? `+${bet.winnings} coins` : 'Lost'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 