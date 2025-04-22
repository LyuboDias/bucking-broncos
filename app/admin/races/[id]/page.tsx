import { getRace, getPlayersForRace, getBetsForRace } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminCheck from "../../admin-check"
import AddPlayerForm from "./add-player-form"
import ManageRaceForm from "./manage-race-form"

export default async function AdminRacePage({ params }: { params: { id: string } }) {
  const race = await getRace(params.id)

  if (!race) {
    notFound()
  }

  const players = await getPlayersForRace(race.id)
  const bets = await getBetsForRace(race.id)

  // Get total bet amount for each player
  const playerBets = players.map((player) => {
    const totalBetAmount = bets.filter((bet) => bet.playerId === player.id).reduce((sum, bet) => sum + bet.amount, 0)

    const betCount = bets.filter((bet) => bet.playerId === player.id).length

    return {
      ...player,
      totalBetAmount,
      betCount,
    }
  })

  return (
    <AdminCheck>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Race: {race.name}</h1>
          <p className="text-muted-foreground mt-2">
            Current status: <span className="font-medium">{race.status}</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <ManageRaceForm race={race} players={players} />

            <Card>
              <CardHeader>
                <CardTitle>Race Participants</CardTitle>
                <CardDescription>{players.length} participants in this race</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playerBets.map((player) => (
                    <div key={player.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.betCount} bets • {player.totalBetAmount} coins
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{player.odds}x</div>
                        <div className="text-sm text-muted-foreground">odds</div>
                      </div>
                    </div>
                  ))}

                  {players.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No participants added yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <AddPlayerForm raceId={race.id} />

            <Card>
              <CardHeader>
                <CardTitle>Bets Placed</CardTitle>
                <CardDescription>{bets.length} bets placed on this race</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bets.map((bet) => (
                    <div key={bet.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                      <div>
                        <div className="font-medium">User #{bet.userId}</div>
                        <div className="text-sm text-muted-foreground">
                          Bet on: {players.find((p) => p.id === bet.playerId)?.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{bet.amount} coins</div>
                        <div className="text-sm text-muted-foreground">{bet.settled ? "Settled" : "Pending"}</div>
                      </div>
                    </div>
                  ))}

                  {bets.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No bets placed yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminCheck>
  )
}
