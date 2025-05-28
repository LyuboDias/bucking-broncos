import { getRaces } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Flag, Info } from "lucide-react"
import { GREEN, GREY, ORANGE } from "@/app/constants"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const races = await getRaces()

  // Sort races in the requested order: "open for betting" first, then "upcoming", finally "settled"
  const openRaces = races.filter(race => race.status === "open")
  const upcomingRaces = races.filter(race => race.status === "upcoming")
  const settledRaces = races.filter(race => race.status === "settled")
  const sortedRaces = [...openRaces, ...upcomingRaces, ...settledRaces]

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mx-auto">
        <h1 className="text-6xl font-bold tracking-tight">Races</h1>
      </div>

      <div className="grid gap-6 w-full max-w-2xl">
        {sortedRaces.length > 0 ? (
          sortedRaces.map((race) => (
            <Card key={race.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center w-full">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold" style={{ color: ORANGE }}>{race.name}</CardTitle>
                  </div>
                  {race.status === "open" && (
                    <div className="flex-1 flex justify-center">
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>4:35min left</div>
                    </div>
                  )}
                  <div className="flex-1 flex justify-end">
                    <StatusBadge status={race.status} />
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                {race.status !== "upcoming" ? (
                  <Link href={`/races/${race.id}`} className="w-full">
                    <Button
                      variant={race.status === "open" ? "default" : "outline"}
                      className="w-full"
                      style={
                        race.status === "open"
                          ? { background: GREEN, borderColor: GREEN, color: "#fff" }
                          : { color: GREEN, border: `2px solid ${GREEN}`, background: "#fff" }
                      }
                    >
                      {race.status === "settled" ? "View Results" : "Place Bet Now"}
                    </Button>
                  </Link>
                ) : (
                  <div className="h-2"></div> 
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="overflow-hidden text-center py-12">
            <CardContent className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Flag className="h-10 w-10" style={{ color: ORANGE }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: ORANGE }}>No Races Available</h3>
              <p className="text-gray-500 mb-6 max-w-md" style={{ color: GREY }}>
                There are no races available at the moment. Races will appear here once they're created.
              </p>
              <div className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 rounded-full">
                <Info className="h-4 w-4" style={{ color: '#000' }} />
                <span style={{ color: '#000' }}>After creating a race, you can add players and manage settings</span>
              </div>
            </CardContent>
          </Card>
        )}
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
        <Badge variant="secondary" className="flex items-center gap-1" style={{ background: '#e6f9e6', color: GREEN }}>
          <Trophy className="h-3 w-3" style={{ color: GREEN }} />
          <span>Settled</span>
        </Badge>
      )
    default:
      return null
  }
}
