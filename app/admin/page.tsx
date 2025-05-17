import { getRaces } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Plus, Flag, AlertCircle } from "lucide-react"
import AdminCheck from "./admin-check"
import CreateRaceForm from "./create-race-form"
import { ORANGE, GREY, GREEN } from "@/app/constants"

export default async function AdminPage() {
  const races = await getRaces()

  // Sort races: open first, then the rest, and show only the first 4
  const openRaces = races.filter(race => race.status === "open")
  const otherRaces = races.filter(race => race.status !== "open")
  const sortedRaces = [...openRaces, ...otherRaces].slice(0, 4)

  return (
    <AdminCheck>
      <div className="space-y-8">
        <div className="w-full max-w-2xl text-center mx-auto">
          <h1 className="text-6xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage races, players, and bets</p>
        </div>

        <div className="w-full max-w-2xl mx-auto space-y-8">
          <CreateRaceForm />

          <Card>
            <CardHeader>
              <CardTitle style={{ color: ORANGE }}>Manage Races</CardTitle>
              <CardDescription style={{ color: GREY }}>Edit race details, add players, and settle races</CardDescription>
              <div className="flex justify-end">
                <Link href="/admin/races">
                  <Button
                    size="sm"
                    style={{ background: GREEN, color: '#fff' }}
                    className="flex items-center gap-1"
                  >
                    View All Races
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedRaces.length > 0 ? (
                  sortedRaces.map((race) => (
                    <div key={race.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                      <div>
                        <div className="font-medium" style={{ color: GREY }}>{race.name}</div>
                        <div className="text-sm" style={{ color: GREY }}>Status: {race.status}</div>
                      </div>
                      <Link href={`/admin/races/${race.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          style={{ border: `2px solid ${ORANGE}`, color: '#000', background: '#fff' }}
                          className="flex items-center gap-1"
                        >
                          <Settings className="h-4 w-4 mr-1" style={{ color: ORANGE }} />
                          Manage
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 flex flex-col items-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-3">
                      <AlertCircle className="h-6 w-6" style={{ color: ORANGE }} />
                    </div>
                    <div className="font-medium mb-1" style={{ color: ORANGE }}>No Races Created Yet</div>
                    <p className="text-sm mb-4" style={{ color: GREY }}>
                      Use the "Create New Race" form above to add your first race
                    </p>
                    <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-gray-100 rounded-full">
                      <Flag className="h-3.5 w-3.5" style={{ color: GREEN }} />
                      <span style={{ color: GREY }}>
                        After creating a race, you can add players and manage settings
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminCheck>
  )
}
