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
      <div className="space-y-8">
        <div className="flex items-center gap-4">
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

        <div className="grid gap-6">
          <CreateRaceForm />

          <Card>
            <CardHeader>
              <CardTitle>All Races</CardTitle>
              <CardDescription>Edit race details, add players, and settle races</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {races.map((race) => (
                  <div key={race.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div>
                      <div className="font-medium">{race.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Status: <span className="capitalize">{race.status}</span> • Created:{" "}
                        {new Date(race.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/races/${race.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/races/${race.id}`}>
                        <Button variant="default" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </Link>
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
