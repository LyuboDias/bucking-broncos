"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Bet, Player } from "@/lib/types"
import { getUser } from "@/lib/data"
import { updateBetAction } from "@/lib/actions"
import { ORANGE, GREY, GREEN } from "@/app/constants"
import { useAuth } from "@/components/auth-provider"

type BetWithDetails = Bet & {
  userName: string
  playerName: string
  odds: number
}

export default function AllUserBets({
  bets,
  players,
  userId,
  raceId,
}: {
  bets: Bet[]
  players: Player[]
  userId?: string
  raceId: string
}) {
  const { toast } = useToast()
  const { updateUserBalance, user: authUser } = useAuth()
  const [betsWithDetails, setBetsWithDetails] = useState<BetWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBetId, setEditingBetId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

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
          <CardTitle className="text-4xl">{userId ? "Your Bets" : "All Bets"}</CardTitle>
          <CardDescription className="text-2xl">{userId ? "Loading your bets..." : "Loading all bets..."}</CardDescription>
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
          <CardTitle className="text-4xl" style={{ color: ORANGE }}>{userId ? "Your Bets" : "All Bets"}</CardTitle>
          <CardDescription className="text-2xl" style={{ color: GREY }}>{userId ? "You haven't placed any bets on this race yet" : "No bets have been placed on this race yet"}</CardDescription>
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

  const handleEditBet = (bet: BetWithDetails) => {
    setEditingBetId(bet.id)
    setEditAmount(bet.amount.toString())
  }

  const handleCancelEdit = () => {
    setEditingBetId(null)
    setEditAmount("")
  }

  const handleUpdateBet = async (bet: BetWithDetails) => {
    if (!userId) return // Only allow editing own bets
    const authUserId = authUser?.id ? String(authUser.id) : undefined
    const targetUserId = userId ? String(userId) : undefined
    
    const newAmount = parseFloat(editAmount)
    if (isNaN(newAmount) || newAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      const result = await updateBetAction(bet.id, newAmount, targetUserId, raceId)
      
      if (result.success) {
        toast({
          title: "Bet updated successfully",
          description: `Stake amount changed to ${newAmount} coins`,
        })

        // Refresh and sync the user balance when updating own bet
        if (authUserId && targetUserId && authUserId === targetUserId) {
          if (typeof result.newBalance === "number") {
            updateUserBalance(result.newBalance)
          } else {
            const latestUser = await getUser(targetUserId)
            if (latestUser) {
              updateUserBalance(latestUser.balance)
            }
          }
        }
        
        // Update local state
        setBetsWithDetails(prev => 
          prev.map(b => 
            b.id === bet.id 
              ? { ...b, amount: newAmount }
              : b
          )
        )
        
        setEditingBetId(null)
        setEditAmount("")
      } else {
        toast({
          title: "Error updating bet",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error updating bet",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Change the title based on whether we're showing all bets or just one user's bets
  const title = userId ? "Your Bets" : "All Bets"
  const description = userId ? "Bets you've placed on this race" : "All bets placed on this race"

  return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-4xl" style={{ color: ORANGE }}>{title}</CardTitle>
          <CardDescription className="text-2xl" style={{ color: GREY }}>{description}</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(betsByUser).map(([betUserId, userData]) => (
            <div key={betUserId} className="space-y-2">
              {!userId && <h3 className="font-semibold text-md">{userData.userName}</h3>}
              <div className="space-y-2 pl-4">
                {userData.bets.map((bet) => (
                  <div key={bet.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium" style={{ color: "#000" }}>{bet.playerName}</div>
                      <div className="text-sm" style={{ color: "#374151" }}>
                        {bet.odds}x odds
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {editingBetId === bet.id ? (
                          <div className="flex items-center gap-2">
                            <div className="text-sm" style={{ color: "#374151" }}>Stake:</div>
                            <Input
                              type="number"
                              min="1"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-20 h-8 text-sm"
                              style={{ color: "#000" }}
                              disabled={isUpdating}
                            />
                            <span className="text-sm" style={{ color: "#374151" }}>coins</span>
                          </div>
                        ) : (
                          <div className="text-sm" style={{ color: "#374151" }}>
                            Stake: <span className="font-semibold" style={{ color: ORANGE }}>{bet.amount} coins</span>
                          </div>
                        )}
                        {!bet.settled && editingBetId !== bet.id && (
                          <div className="text-sm" style={{ color: "#374151" }}>
                            Potential Winnings: <span className="font-semibold" style={{ color: "#059669" }}>{bet.amount * bet.odds} coins</span>
                          </div>
                        )}
                        {!bet.settled && editingBetId === bet.id && (
                          <div className="text-sm" style={{ color: "#374151" }}>
                            Potential Winnings: <span className="font-semibold" style={{ color: "#059669" }}>{(parseFloat(editAmount) || 0) * bet.odds} coins</span>
                          </div>
                        )}
                        {bet.settled && (
                          <div className={`text-sm ${bet.winnings > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {bet.winnings > 0 ? `Won: +${bet.winnings} coins` : 'Lost'}
                          </div>
                        )}
                      </div>
                      {userId && bet.userId === userId && !bet.settled && (
                        <div className="flex items-center gap-1">
                          {editingBetId === bet.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateBet(bet)}
                                disabled={isUpdating}
                                style={{ background: GREEN, color: '#fff' }}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="h-8 w-8 p-0"
                                style={{ color: "#000" }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditBet(bet)}
                              disabled={editingBetId !== null}
                              className="h-8 w-8 p-0"
                              style={{ borderColor: ORANGE, color: ORANGE }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
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
