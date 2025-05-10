import { getRaces, getPlayersForRace } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Users } from "lucide-react"
import { GREEN, GREY, ORANGE } from "@/lib/colors"

export default async function Home() {
  const races = await getRaces()

  // Sort races: open for betting first, then the rest
  const openRaces = races.filter(race => race.status === "open")
  const otherRaces = races.filter(race => race.status !== "open")
  const sortedRaces = [...openRaces, ...otherRaces]

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mx-auto">
        <h1 className="text-6xl font-bold tracking-tight">Races</h1>
      </div>

      <div className="grid gap-6 w-full max-w-2xl">
        {sortedRaces.map(async (race) => {
          const players = await getPlayersForRace(race.id)
          return (
            <Card key={race.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-bold" style={{ color: ORANGE }}>{race.name}</CardTitle>
                  <StatusBadge status={race.status} />
                </div>
                <CardDescription style={{ color: GREY }}>{new Date(race.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-2 text-sm mb-4" style={{ color: GREY }}>
                  <Users className="h-4 w-4" />
                  <span>{players.length} participants</span>
                </div>

                <div className="space-y-2">
                  {players.slice(0, 3).map((player) => (
                    <div key={player.id} className="flex justify-between items-center">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm">
                        <span style={{ color: GREY }}>Odds: </span>
                        <span style={{ color: ORANGE, fontWeight: 700 }}>{player.odds}x</span>
                      </div>
                    </div>
                  ))}

                  {players.length > 3 && (
                    <div className="text-sm text-center pt-1" style={{ color: ORANGE }}>
                      +{players.length - 3} more participants
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/races/${race.id}`} className="w-full">
                  <Button
                    variant={race.status === "open" ? "default" : "outline"}
                    className="w-full"
                    style={
                      race.status === "open"
                        ? { background: GREEN, borderColor: GREEN, color: "#fff" }
                        : race.status === "settled"
                        ? {}
                        : { color: ORANGE, border: `2px solid ${ORANGE}`, background: "#fff" }
                    }
                  >
                    {race.status === "settled"
                      ? "View Results"
                      : race.status === "open"
                        ? "Place Bet Now"
                        : "View Race"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "upcoming":
      return (
        <Badge
          variant="outline"
          style={{ background: ORANGE, color: "#fff", border: "none" }}
        >
          <Clock className="h-3 w-3 pr-1" style={{ color: "#fff" }} />
          <span>Upcoming</span>
        </Badge>
      )
    case "open":
      return (
        <Badge variant="secondary" style={{ background: GREEN, color: "#fff" }}>
          <span>Open for Betting</span>
        </Badge>
      )
    case "settled":
      return (
        <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Trophy className="h-3 w-3" />
          <span>Settled</span>
        </Badge>
      )
    default:
      return null
  }
}
