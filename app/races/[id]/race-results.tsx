"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import type { Race, Player, Bet } from "@/lib/types"
import { getUser } from "@/lib/data"
import { ORANGE, GREY, GREEN } from "@/app/constants"

type BetWithUserName = Bet & { userName: string }

export default function RaceResults({
  race,
  players,
  bets,
  winner,
}: {
  race: Race
  players: Player[]
  bets: Bet[]
  winner: Player | null
}) {
  const [betsWithUserNames, setBetsWithUserNames] = useState<BetWithUserName[]>([])
  const [loading, setLoading] = useState(true)
  
  // Get 2nd and 3rd place players
  const secondPlace = race.secondPlaceId 
    ? players.find(player => player.id === race.secondPlaceId) 
    : null;
  
  const thirdPlace = race.thirdPlaceId 
    ? players.find(player => player.id === race.thirdPlaceId) 
    : null;

  useEffect(() => {
    async function loadUserNames() {
      try {
        // Get user names for all winning bets
        const winningBets = bets.filter(bet => 
          (bet.playerId === race.winnerId) || 
          (bet.playerId === race.secondPlaceId) || 
          (bet.playerId === race.thirdPlaceId)
        );
        
        const userPromises = winningBets.map(async (bet) => {
          const user = await getUser(bet.userId)
          return {
            ...bet,
            userName: user?.name || `User #${bet.userId}`,
          }
        })

        const result = await Promise.all(userPromises)
        setBetsWithUserNames(result)
        setLoading(false)
      } catch (error) {
        console.error("Error loading user names:", error)
        setLoading(false)
      }
    }

    loadUserNames()
  }, [bets, race.winnerId, race.secondPlaceId, race.thirdPlaceId])

  // Calculate total bets and winnings
  const totalBets = bets.reduce((sum, bet) => sum + bet.amount, 0)
  const totalWinnings = bets.reduce((sum, bet) => sum + bet.winnings, 0)

  // Sort players by placement
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.id === race.winnerId) return -1;
    if (b.id === race.winnerId) return 1;
    if (a.id === race.secondPlaceId) return -1;
    if (b.id === race.secondPlaceId) return 1;
    if (a.id === race.thirdPlaceId) return -1;
    if (b.id === race.thirdPlaceId) return 1;
    
    // For remaining players, sort by total bet amount
    const aBets = bets.filter((bet) => bet.playerId === a.id).reduce((sum, bet) => sum + bet.amount, 0)
    const bBets = bets.filter((bet) => bet.playerId === b.id).reduce((sum, bet) => sum + bet.amount, 0)
    return bBets - aBets
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2" style={{ color: ORANGE }}>
            <Trophy className="h-5 w-5" style={{ color: ORANGE }} />
            Race Results
          </CardTitle>
          <CardDescription style={{ color: GREY }}>
            {winner ? (
              <span className="flex items-center gap-1">
                <span className="font-medium">{winner.name}</span> took 1st place! 
                {secondPlace && <span> <span className="font-medium">{secondPlace.name}</span> came 2nd.</span>}
                {thirdPlace && <span> <span className="font-medium">{thirdPlace.name}</span> came 3rd.</span>}
              </span>
            ) : (
              "Race has been settled"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedPlayers.map((player) => {
              const isWinner = player.id === race.winnerId;
              const isSecondPlace = player.id === race.secondPlaceId;
              const isThirdPlace = player.id === race.thirdPlaceId;
              const hasPlacement = isWinner || isSecondPlace || isThirdPlace;
              const playerBets = bets.filter((bet) => bet.playerId === player.id);
              const totalBetAmount = playerBets.reduce((sum, bet) => sum + bet.amount, 0);
              const totalWinnings = playerBets.reduce((sum, bet) => sum + bet.winnings, 0);
              return (
                <div
                  key={player.id}
                  className={`flex justify-between items-center pb-4 border-b last:border-0 ${
                    isWinner ? "bg-yellow-50 px-6 py-2 rounded-md" : 
                    isSecondPlace ? "bg-gray-50 px-6 py-2 rounded-md" :
                    isThirdPlace ? "bg-amber-50 px-6 py-2 rounded-md" : "px-6"
                  }`}
                  style={{ paddingLeft: 24, paddingRight: 24 }}
                >
                  <div className="flex items-center gap-2">
                    {isWinner && <Trophy className="h-4 w-4" style={{ color: ORANGE }} />}
                    {isSecondPlace && <Medal className="h-4 w-4" style={{ color: ORANGE }} />}
                    {isThirdPlace && <Award className="h-4 w-4" style={{ color: ORANGE }} />}
                    <div>
                      <div className="font-medium" style={{ color: hasPlacement ? '#000' : GREY }}>
                        {player.name}
                        {isWinner && <span className="ml-1 text-xs font-normal" style={{ color: GREEN }}>(1st)</span>}
                        {isSecondPlace && <span className="ml-1 text-xs font-normal" style={{ color: ORANGE }}>(2nd)</span>}
                        {isThirdPlace && <span className="ml-1 text-xs font-normal" style={{ color: ORANGE }}>(3rd)</span>}
                      </div>
                      <div className="text-sm" style={{ color: hasPlacement ? '#000' : GREY }}>
                        {playerBets.length} bets • <span style={{ color: GREEN }}>{totalBetAmount} coins</span>
                        {totalWinnings > 0 && <span style={{ color: GREEN }}> • {totalWinnings} coins won</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold" style={{ color: ORANGE }}>{player.odds}x</div>
                    <div className="text-sm" style={{ color: hasPlacement ? '#000' : GREY }}>odds</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm" style={{ color: GREY }}>Total Bets</div>
              <div className="font-semibold" style={{ color: GREEN }}>{totalBets} coins</div>
            </div>
            <div>
              <div className="text-sm" style={{ color: GREY }}>Total Winnings</div>
              <div className="font-semibold" style={{ color: GREEN }}>{totalWinnings} coins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{ color: ORANGE }}>Winning Bets</CardTitle>
          <CardDescription style={{ color: GREY }}>
            Bets on 1st place winner get full odds. 
            2nd and 3rd place bets get half odds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4" style={{ color: GREY }}>Loading winning bets...</div>
          ) : winner ? (
            <div className="space-y-4">
              {betsWithUserNames.length > 0 ? (
                betsWithUserNames
                  .slice()
                  .sort((a, b) => {
                    const getRank = (bet: BetWithUserName) => {
                      if (bet.playerId === race.winnerId) return 0;
                      if (bet.playerId === race.secondPlaceId) return 1;
                      if (bet.playerId === race.thirdPlaceId) return 2;
                      return 3;
                    };
                    return getRank(a) - getRank(b);
                  })
                  .map((bet, index) => {
                    // Determine which player was bet on
                    const player = players.find(p => p.id === bet.playerId);
                    const isWinnerBet = bet.playerId === race.winnerId;
                    const isSecondBet = bet.playerId === race.secondPlaceId;
                    const isThirdBet = bet.playerId === race.thirdPlaceId;
                    
                    return (
                      <div key={bet.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          {isWinnerBet && <Trophy className="h-4 w-4" style={{ color: ORANGE }} />}
                          {isSecondBet && <Medal className="h-4 w-4" style={{ color: ORANGE }} />}
                          {isThirdBet && <Award className="h-4 w-4" style={{ color: ORANGE }} />}
                          <div>
                            <div className="font-medium" style={{ color: GREY }}>{bet.userName}</div>
                            <div className="text-sm" style={{ color: GREY }}>
                              Bet {bet.amount} coins on {player?.name}
                              {isWinnerBet ? " (1st)" : isSecondBet ? " (2nd)" : " (3rd)"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold" style={{ color: GREEN }}>+{bet.winnings} coins</div>
                          <div className="text-sm" style={{ color: GREY }}>
                            <span style={{ color: ORANGE }}>{player?.odds}x</span>{isWinnerBet ? ' full odds' : ' half odds'}
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-4" style={{ color: GREY }}>No winning bets for this race</div>
              )}
            </div>
          ) : (
            <div className="text-center py-4" style={{ color: GREY }}>No winner has been declared</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
