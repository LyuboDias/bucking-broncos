import { getUsers, getBetsForRace, getRaces } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, TrendingUp, TrendingDown } from "lucide-react"

export default async function LeaderboardPage() {
  const users = await getUsers()
  const races = await getRaces()

  // Get all bets for all races
  const allBets = []
  for (const race of races) {
    const raceBets = await getBetsForRace(race.id)
    allBets.push(...raceBets)
  }

  // Calculate user stats
  const userStats = users
    .filter((user) => !user.isAdmin) // Exclude admin users
    .map((user) => {
      const userBets = allBets.filter((bet) => bet.userId === user.id)
      const totalBetAmount = userBets.reduce((sum, bet) => sum + bet.amount, 0)
      const totalWinnings = userBets.reduce((sum, bet) => sum + bet.winnings, 0)
      const netProfit = totalWinnings - totalBetAmount
      const winRate = userBets.length > 0 ? userBets.filter((bet) => bet.winnings > 0).length / userBets.length : 0

      return {
        ...user,
        totalBetAmount,
        totalWinnings,
        netProfit,
        winRate,
        betsPlaced: userBets.length,
      }
    })
    .sort((a, b) => b.balance - a.balance)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Users ranked by their current balance</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Players
            </CardTitle>
            <CardDescription>Based on current balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.map((user, index) => (
                <div key={user.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold text-sm">
                      {index === 0 ? (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="h-4 w-4 text-gray-400" />
                      ) : index === 2 ? (
                        <Medal className="h-4 w-4 text-amber-600" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.betsPlaced} bets • {Math.round(user.winRate * 100)}% win rate
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{user.balance} coins</div>
                    <div className="flex items-center justify-end gap-1 text-sm">
                      {user.netProfit > 0 ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-green-600">+{user.netProfit}</span>
                        </>
                      ) : user.netProfit < 0 ? (
                        <>
                          <TrendingDown className="h-3 w-3 text-red-500" />
                          <span className="text-red-600">{user.netProfit}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">No change</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {userStats.length === 0 && <div className="text-center py-4 text-muted-foreground">No users found</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
