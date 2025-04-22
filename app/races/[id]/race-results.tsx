import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"
import type { Race, Player, Bet } from "@/lib/types"
import { getUser } from "@/lib/data"

export default async function RaceResults({
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
  // Calculate total bets and winnings
  const totalBets = bets.reduce((sum, bet) => sum + bet.amount, 0)
  const totalWinnings = bets.reduce((sum, bet) => sum + bet.winnings, 0)

  // Sort players by total bet amount
  const sortedPlayers = [...players].sort((a, b) => {
    const aBets = bets.filter((bet) => bet.playerId === a.id).reduce((sum, bet) => sum + bet.amount, 0)
    const bBets = bets.filter((bet) => bet.playerId === b.id).reduce((sum, bet) => sum + bet.amount, 0)
    return bBets - aBets
  })

  // Get user names for bets
  const userPromises = bets
    .filter((bet) => bet.playerId === race.winnerId)
    .map(async (bet) => {
      const user = await getUser(bet.userId)
      return {
        ...bet,
        userName: user?.name || `User #${bet.userId}`,
      }
    })

  const betsWithUserNames = await Promise.all(userPromises)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Race Results
          </CardTitle>
          <CardDescription>{winner ? `${winner.name} won the race` : "Race has been settled"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => {
              const isWinner = player.id === race.winnerId
              const playerBets = bets.filter((bet) => bet.playerId === player.id)
              const totalBetAmount = playerBets.reduce((sum, bet) => sum + bet.amount, 0)

              return (
                <div
                  key={player.id}
                  className={`flex justify-between items-center pb-4 border-b last:border-0 ${
                    isWinner ? "bg-yellow-50 -mx-6 px-6 py-2 rounded-md" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                    <div>
                      <div className={`font-medium ${isWinner ? "text-black" : ""}`}>{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {playerBets.length} bets • {totalBetAmount} coins
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${isWinner ? "text-black" : ""}`}>{player.odds}x</div>
                    <div className="text-sm text-muted-foreground">odds</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Bets</div>
              <div className="font-semibold">{totalBets} coins</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Winnings</div>
              <div className="font-semibold">{totalWinnings} coins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Winning Bets</CardTitle>
          <CardDescription>Users who bet on the winner</CardDescription>
        </CardHeader>
        <CardContent>
          {winner ? (
            <div className="space-y-4">
              {betsWithUserNames
                .sort((a, b) => b.amount - a.amount)
                .map((bet, index) => (
                  <div key={bet.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Medal className="h-4 w-4 text-yellow-500" />}
                      <div>
                        <div className="font-medium">{bet.userName}</div>
                        <div className="text-sm text-muted-foreground">Bet {bet.amount} coins</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">+{bet.winnings} coins</div>
                      <div className="text-sm text-muted-foreground">{winner.odds}x return</div>
                    </div>
                  </div>
                ))}

              {betsWithUserNames.length === 0 && (
                <div className="text-muted-foreground text-center py-4">No winning bets for this race</div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-4">No winner has been declared</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
