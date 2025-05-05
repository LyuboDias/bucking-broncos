import { getRaces } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Plus } from "lucide-react"
import AdminCheck from "./admin-check"
import CreateRaceForm from "./create-race-form"

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
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage races, players, and bets</p>
        </div>

        <div className="w-full max-w-2xl mx-auto space-y-8">
          <CreateRaceForm />

          <Card>
            <CardHeader>
              <CardTitle>Manage Races</CardTitle>
              <CardDescription>Edit race details, add players, and settle races</CardDescription>
              <div className="flex justify-end">
                <Link href="/admin/races">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-green-600 text-green-700"
                  >
                    View All Races
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedRaces.map((race) => (
                  <div key={race.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div>
                      <div className="font-medium">{race.name}</div>
                      <div className="text-sm text-muted-foreground">Status: {race.status}</div>
                    </div>
                    <Link href={`/admin/races/${race.id}`}>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </Link>
                  </div>
                ))}

                {sortedRaces.length === 0 && <div className="text-center py-4 text-muted-foreground">No races found</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminCheck>
  )
}
