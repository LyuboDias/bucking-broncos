import { getRaces } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Plus } from "lucide-react"
import AdminCheck from "./admin-check"
import CreateRaceForm from "./create-race-form"

export default async function AdminPage() {
  const races = await getRaces()

  return (
    <AdminCheck>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage races, players, and bets</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <CreateRaceForm />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Manage Races</CardTitle>
                <CardDescription>Edit race details, add players, and settle races</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="flex items-center gap-1">
                <Link href="/admin/races">
                  <Plus className="h-4 w-4" />
                  <span>View All</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {races.map((race) => (
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

                {races.length === 0 && <div className="text-center py-4 text-muted-foreground">No races found</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminCheck>
  )
}
