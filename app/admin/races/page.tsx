import { getRaces } from "@/lib/data"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, ArrowLeft, AlertCircle, PlusCircle } from "lucide-react"
import AdminCheck from "../admin-check"
import CreateRaceForm from "../create-race-form"
import BulkRaceButtons from "./bulk-race-buttons"
import { ORANGE, GREY, GREEN } from "@/app/constants"

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminRacesPage() {
  const races = await getRaces()

  return (
    <AdminCheck>
      <div className="space-y-8 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center mx-auto">
          <div className="flex items-center justify-center gap-4">
            <Link href="/admin">
              <Button
                variant="outline"
                size="icon"
                style={{ border: `2px solid ${ORANGE}`, color: ORANGE }}
              >
                <ArrowLeft className="h-4 w-4" style={{ color: ORANGE }} />
              </Button>
            </Link>
            <div>
              <h1 className="text-6xl font-bold tracking-tight">Manage Races</h1>
              <p className=" mt-2">View and manage all races</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl space-y-8">
          <CreateRaceForm />
          
          {/* Bulk Race Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl" style={{ color: ORANGE }}>Bulk Race Actions</CardTitle>
              <CardDescription className="text-2xl" style={{ color: GREY }}>Open or close all races at once</CardDescription>
            </CardHeader>
            <CardContent>
              <BulkRaceButtons />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-4xl" style={{ color: ORANGE }}>All Races</CardTitle>
              <CardDescription className="text-2xl" style={{ color: GREY }}>Edit race details, add players, and settle races</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {races.length > 0 ? (
                  races.map((race) => (
                    <div key={race.id} className="flex flex-col border-b last:border-0 pb-4 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-xl" style={{ color: ORANGE }}>{race.name}</span>
                            {race.status === "open" && (
                              <span className="text-sm font-semibold rounded-full" style={{ background: GREEN, color: '#fff', fontSize: '0.5rem', padding: '1px 8px' }}>
                                Open for Betting
                              </span>
                            )}
                            {race.status === "upcoming" && (
                              <span className="text-sm font-semibold rounded-full" style={{ background: '#fbbf24', color: '#000', fontSize: '0.5rem', padding: '1px 8px' }}>
                                Upcoming
                              </span>
                            )}
                            {(race.status === "close" || race.status === "closed") && (
                              <span
                                className="text-sm font-semibold rounded-full"
                                style={{
                                  background: ORANGE,
                                  color: "#fff",
                                  fontSize: "0.5rem",
                                  padding: "1px 8px",
                                }}
                              >
                                Closed
                              </span>
                            )}
                            {race.status === "settled" && (
                              <span
                                className="text-sm font-semibold rounded-full"
                                style={{
                                  background: "#fecaca",
                                  color: "#dc2626",
                                  fontSize: "0.5rem",
                                  padding: "1px 8px",
                                  border: `1px solid #dc2626`,
                                }}
                              >
                                Settled
                              </span>
                            )}
                          </div>
                          <div className="text-muted-foreground mt-1" style={{ color: GREY, fontSize: '0.85rem' }}>
                            Created on {new Date(race.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/races/${race.id}`}>
                            <Button
                              size="sm"
                              style={{ background: GREEN, color: '#fff' }}
                              className="flex items-center gap-1"
                            >
                              View
                            </Button>
                          </Link>
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
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <AlertCircle className="h-6 w-6" style={{ color: ORANGE }} />
                    </div>
                    <h3 className="mt-2 text-lg font-semibold" style={{ color: ORANGE }}>No races found</h3>
                    <p className="mt-1 text-sm" style={{ color: GREY }}>
                      Get started by creating your first race using the form above.
                    </p>
                    <div className="mt-6">
                      <Button
                        size="sm"
                        onClick={() => {
                          // Focus the race name input in the form
                          const inputElement = document.querySelector('input[name="raceName"]') as HTMLInputElement;
                          if (inputElement) inputElement.focus();
                        }}
                        style={{ background: GREEN, color: '#fff' }}
                        className="flex items-center gap-1 mx-auto"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Create Your First Race
                      </Button>
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
