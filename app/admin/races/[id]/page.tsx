import { getRace, getPlayersForRace, getBetsForRace, getUser } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminCheck from "../../admin-check"
import AddPlayerForm from "./add-player-form"
import ManageRaceForm from "./manage-race-form"
import { ORANGE, GREY, GREEN } from "@/app/constants"

// Define the props type for the page component
type AdminRacePageProps = {
  params: { id: string }
}

export default async function AdminRacePage({ params }: AdminRacePageProps) {
  // Extract the ID directly to avoid the warning
  const race = await getRace(params.id)

  if (!race) {
    notFound()
  }

  const players = await getPlayersForRace(race.id)
  const bets = await getBetsForRace(race.id)
  
  // Get usernames for each bet
  const betsWithUserPromises = bets.map(async (bet) => {
    const user = await getUser(bet.userId)
    return {
      ...bet,
      username: user?.name || `User #${bet.userId}`
    }
  })
  
  const betsWithUsers = await Promise.all(betsWithUserPromises)

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
              <span className="text-sm font-semibold rounded-full" style={{ background: GREEN, color: '#fff', fontSize: '0.85rem', padding: '2px 16px' }}>
                Open for Betting
              </span>
            )}
            {race.status === "upcoming" && (
              <span className="text-sm font-semibold rounded-full" style={{ background: ORANGE, color: '#fff', fontSize: '0.85rem', padding: '2px 16px' }}>
                Upcoming
              </span>
            )}
            {race.status === "settled" && (
              <span className="text-sm font-semibold rounded-full" style={{ background: '#fff', color: GREEN, fontSize: '0.85rem', padding: '2px 16px', border: `1px solid ${GREEN}` }}>
                Settled
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
              <CardTitle style={{ color: ORANGE }}>Bets Placed</CardTitle>
              <CardDescription style={{ color: GREY }}>{bets.length} bets placed on this race</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {betsWithUsers.map((bet) => (
                  <div key={bet.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div>
                      <div className="font-medium">{bet.username}</div>
                      <div className="text-sm">
                        <span style={{ color: GREY }}>Bet on: </span>
                        <span style={{ color: ORANGE }}>{players.find((p) => p.id === bet.playerId)?.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: GREEN }}>{bet.amount} coins</div>
                      <div className="text-sm" style={{ color: GREY }}>{bet.settled ? "Settled" : "Pending"}</div>
                    </div>
                  </div>
                ))}
                {bets.length === 0 && (
                  <div className="text-center py-4" style={{ color: GREY }}>No bets placed yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 4. Race Participants */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: ORANGE }}>Race Participants</CardTitle>
              <CardDescription style={{ color: GREY }}>{players.length} participants in this race</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div>
                      <div className="font-medium" style={{ color: '#fff' }}>{player.name}</div>
                      <div className="text-sm" style={{ color: GREY }}>
                        {bets.filter((bet) => bet.playerId === player.id).length} bets •
                        <span style={{ color: GREEN }}>{bets.filter((bet) => bet.playerId === player.id).reduce((sum, bet) => sum + bet.amount, 0)} coins</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold" style={{ color: ORANGE }}>{player.odds}x</div>
                      <div className="text-sm" style={{ color: GREY }}>odds</div>
                    </div>
                  </div>
                ))}
                {players.length === 0 && (
                  <div className="text-center py-4" style={{ color: GREY }}>No participants added yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminCheck>
  )
}
