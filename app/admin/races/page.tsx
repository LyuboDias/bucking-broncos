import { getRaces } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, ArrowLeft } from "lucide-react"
import AdminCheck from "../admin-check"
import CreateRaceForm from "../create-race-form"

export default async function AdminRacesPage() {
  const races = await getRaces()

  return (
    <AdminCheck>
      <div className="space-y-8 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center mx-auto">
          <div className="flex items-center justify-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manage Races</h1>
              <p className="text-muted-foreground mt-2">View and manage all races</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl space-y-8">
          <CreateRaceForm />

          <Card>
            <CardHeader>
              <CardTitle>All Races</CardTitle>
              <CardDescription>Edit race details, add players, and settle races</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {races.map((race) => (
                  <div key={race.id} className="flex flex-col border-b last:border-0 pb-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xl">{race.name}</span>
                          {race.status === "open" && (
                            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                              Open for Betting
                            </span>
                          )}
                          {race.status === "upcoming" && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-400 text-sm font-semibold px-3 py-1 rounded-full">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground mt-1">
                          Created on {new Date(race.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/races/${race.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link href={`/admin/races/${race.id}`}>
                          <Button variant="default" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
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
