import { getRaces } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Plus, Flag, AlertCircle } from "lucide-react"
import AdminCheck from "./admin-check"
import ManagePlayersPanel from "./manage-players-panel"
import { ORANGE, GREY, GREEN } from "@/app/constants"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPage() {
  const races = await getRaces()

  // Show only the first 4 races (ordered by creation date ascending)
  const displayRaces = races.slice(0, 4)

  return (
    <AdminCheck>
      <div className="space-y-8">
        <div className="w-full max-w-2xl text-center mx-auto">
          <h1 className="text-6xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className=" mt-2">Manage races, players, and bets</p>
        </div>

        <div className="w-full max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-4xl" style={{ color: ORANGE }}>Races</CardTitle>
                  <CardDescription className="text-2xl" style={{ color: GREY }}>Edit race details, add players, and settle races</CardDescription>
                </div>
                <Link href="/admin/races">
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ border: `2px solid ${ORANGE}`, color: ORANGE, background: '#fff' }}
                    className="flex items-center gap-1"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage Races
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>

          <ManagePlayersPanel />
        </div>
      </div>
    </AdminCheck>
  )
}
