import { getRace, getPlayersForRace, getBetsForRace } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PlaceBetForm from "./place-bet-form"
import RaceResults from "./race-results"

export default async function RacePage({ params }: { params: { id: string } }) {
  const race = await getRace(params.id)

  if (!race) {
    notFound()
  }

  const players = await getPlayersForRace(race.id)
  const bets = await getBetsForRace(race.id)

  let winner = null
  if (race.winnerId) {
    winner = players.find((player) => player.id === race.winnerId)
  }

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
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{race.name}</h1>
          <StatusBadge status={race.status} />
        </div>
        <p className="text-muted-foreground">
          Created on {new Date(race.createdAt).toLocaleDateString()}
          {race.settledAt && ` • Settled on ${new Date(race.settledAt).toLocaleDateString()}`}
        </p>
      </div>

      {race.status === "settled" ? (
        <RaceResults race={race} players={players} bets={bets} winner={winner} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                {race.status === "open" ? "Place your bets on who will win" : "Race will open for betting soon"}
              </CardDescription>
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
              </div>
            </CardContent>
          </Card>

          <PlaceBetForm race={race} players={players} />
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "upcoming":
      return <Badge variant="outline">Upcoming</Badge>
    case "open":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
          Open for Betting
        </Badge>
      )
    case "settled":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Settled
        </Badge>
      )
    default:
      return null
  }
}
