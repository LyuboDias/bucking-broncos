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
      <div className="space-y-8 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center mx-auto flex flex-col items-center">
          <h1 className="text-6xl font-bold tracking-tight">Manage Race</h1>
          <div className="text-2xl font-semibold mt-2">{race.name}</div>
          <div className="mt-2">
            {race.status === "open" && (
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                Status: Open for Betting
              </span>
            )}
            {race.status === "upcoming" && (
              <span className="bg-amber-50 text-amber-700 border border-amber-400 text-sm font-semibold px-3 py-1 rounded-full">
                Status: Upcoming
              </span>
            )}
            {race.status === "settled" && (
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                Status: Settled
              </span>
            )}
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-8">
          {/* 1. Add Participant */}
          <AddPlayerForm raceId={race.id} />

          {/* 2. Manage Race */}
          <Card>
            <ManageRaceForm race={race} players={players} />
          </Card>

          {/* 3. Bets Placed */}
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

          {/* 4. Race Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Race Participants</CardTitle>
              <CardDescription>{players.length} participants in this race</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {bets.filter((bet) => bet.playerId === player.id).length} bets •
                        {bets.filter((bet) => bet.playerId === player.id).reduce((sum, bet) => sum + bet.amount, 0)} coins
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
      </div>
    </AdminCheck>
  )
}
