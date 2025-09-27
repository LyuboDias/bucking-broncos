"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ORANGE, GREY, GREEN } from "@/app/constants"
import { Trophy, Medal, Award, TrendingUp, Users, Coins, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Race, Player, Bet } from "@/lib/types"

type RaceStatsPageProps = {
  params: { id: string }
}

export default function RaceStatsPage({ params }: RaceStatsPageProps) {
  const [race, setRace] = useState<Race | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const router = useRouter()

  const fetchRaceData = async () => {
    try {
      const response = await fetch(`/api/races/${params.id}/stats`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          router.push('/admin/races')
          return
        }
        throw new Error('Failed to fetch race data')
      }

      const data = await response.json()
      setRace(data.race)
      setPlayers(data.players)
      setBets(data.bets)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching race data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRaceData()

    const interval = setInterval(fetchRaceData, 3000)

    return () => clearInterval(interval)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" style={{ color: ORANGE }} />
          <span className="text-xl" style={{ color: GREY }}>Loading race statistics...</span>
        </div>
      </div>
    )
  }

  if (!race) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: ORANGE }}>Race Not Found</h1>
          <Link href="/admin/races">
            <Button variant="outline" style={{ border: `2px solid ${ORANGE}`, color: ORANGE }}>
              ← Back to Races
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalCoinsWagered = bets.reduce((sum, bet) => sum + bet.amount, 0)
  const totalParticipants = players.length
  const totalBetsPlaced = bets.length
  const totalWinnings = bets.reduce((sum, bet) => sum + (bet.winnings || 0), 0)

  const playerStats = players.map((player) => {
    const playerBets = bets.filter((bet) => bet.playerId === player.id)
    const totalPlayerBets = playerBets.length
    const totalPlayerCoins = playerBets.reduce((sum, bet) => sum + bet.amount, 0)
    const percentageOfTotalCoins = totalCoinsWagered > 0 ? (totalPlayerCoins / totalCoinsWagered) * 100 : 0

    return {
      ...player,
      totalBets: totalPlayerBets,
      totalCoins: totalPlayerCoins,
      percentageOfTotalCoins: parseFloat(percentageOfTotalCoins.toFixed(2)),
    }
  })

  // Keep original race order instead of sorting by coins
  const sortedPlayerStats = playerStats

  // Removed getPlayerPosition function as we don't want to show winners in public stats

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge style={{ background: '#fbbf24', color: '#000', borderColor: '#fbbf24' }}>
            Upcoming
          </Badge>
        )
      case "open":
        return (
          <Badge style={{ background: GREEN, color: '#fff', borderColor: GREEN }}>
            Open for Betting
          </Badge>
        )
      case "close":
      case "closed":
        return (
          <Badge style={{ background: ORANGE, color: '#fff', borderColor: ORANGE }}>
            Closed
          </Badge>
        )
      case "settled":
        return (
          <Badge style={{ background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}>
            Settled
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full fixed inset-0 overflow-auto" style={{ backgroundColor: '#0f172a' }}>
      <div className="space-y-8 flex flex-col items-center py-8">
        <div className="w-full max-w-4xl text-center mx-auto flex flex-col items-center">
          <h1 className="text-6xl font-bold tracking-tight" style={{ color: '#ffffff' }}>Race Statistics</h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="text-3xl font-semibold" style={{ color: '#ffffff' }}>{race.name}</div>
            <StatusBadge status={race.status} />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <RefreshCw className="h-4 w-4 animate-spin" style={{ color: GREEN }} />
            <span className="text-base font-medium" style={{ color: '#d1d5db' }}>
              Live updates • Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          <Link href={`/admin/races/${race.id}`} className="mt-6">
            <Button 
              variant="outline" 
              className="text-lg px-6 py-3 font-semibold" 
              style={{ 
                border: `3px solid ${ORANGE}`, 
                color: ORANGE, 
                backgroundColor: '#1e293b',
                borderRadius: '12px'
              }}
            >
              ← Back to Manage Race
            </Button>
          </Link>
        </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card style={{ backgroundColor: '#1e293b', border: `2px solid ${ORANGE}` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-bold" style={{ color: '#ffffff' }}>Total Participants</CardTitle>
              <Users className="h-6 w-6" style={{ color: ORANGE }} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" style={{ color: ORANGE }}>{totalParticipants}</div>
            </CardContent>
          </Card>
          <Card style={{ backgroundColor: '#1e293b', border: `2px solid ${GREEN}` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-bold" style={{ color: '#ffffff' }}>Total Bets Placed</CardTitle>
              <TrendingUp className="h-6 w-6" style={{ color: GREEN }} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" style={{ color: GREEN }}>{totalBetsPlaced}</div>
            </CardContent>
          </Card>
          <Card style={{ backgroundColor: '#1e293b', border: `2px solid ${ORANGE}` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-bold" style={{ color: '#ffffff' }}>Total Coins Wagered</CardTitle>
              <Coins className="h-6 w-6" style={{ color: ORANGE }} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold" style={{ color: ORANGE }}>{totalCoinsWagered}</div>
            </CardContent>
          </Card>
        </div>

        {/* Race Results - Only show when settled */}
        {race.status === "settled" && (
          <Card style={{ backgroundColor: '#1e293b', border: `3px solid #dc2626` }}>
            <CardHeader>
              <CardTitle className="text-3xl font-bold" style={{ color: '#ffffff' }}>🏆 Race Results</CardTitle>
              <CardDescription className="text-xl font-medium" style={{ color: '#d1d5db' }}>
                Final standings and total winnings distributed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Winners */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold" style={{ color: '#ffffff' }}>Winners</h3>
                  <div className="space-y-3">
                    {race.winnerId && (
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#fbbf24', color: '#000' }}>
                        <Trophy className="h-6 w-6" />
                        <div className="flex-1">
                          <div className="font-bold text-lg">1st Place</div>
                          <div className="text-base">{players.find(p => p.id === race.winnerId)?.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{players.find(p => p.id === race.winnerId)?.odds}x odds</div>
                        </div>
                      </div>
                    )}
                    {race.secondPlaceId && (
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#9ca3af', color: '#000' }}>
                        <Medal className="h-6 w-6" />
                        <div className="flex-1">
                          <div className="font-bold text-lg">2nd Place</div>
                          <div className="text-base">{players.find(p => p.id === race.secondPlaceId)?.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{players.find(p => p.id === race.secondPlaceId)?.odds}x odds</div>
                        </div>
                      </div>
                    )}
                    {race.thirdPlaceId && (
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#d97706', color: '#000' }}>
                        <Award className="h-6 w-6" />
                        <div className="flex-1">
                          <div className="font-bold text-lg">3rd Place</div>
                          <div className="text-base">{players.find(p => p.id === race.thirdPlaceId)?.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{players.find(p => p.id === race.thirdPlaceId)?.odds}x odds</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Winnings Summary */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold" style={{ color: '#ffffff' }}>Winnings Summary</h3>
                  <div className="space-y-3">
                    <Card style={{ backgroundColor: '#065f46', border: `2px solid #10b981` }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold" style={{ color: '#ffffff' }}>Total Winnings Paid</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold" style={{ color: '#10b981' }}>{totalWinnings} coins</div>
                      </CardContent>
                    </Card>
                    <Card style={{ backgroundColor: '#1e293b', border: `2px solid ${ORANGE}` }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold" style={{ color: '#ffffff' }}>Total Wagered</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold" style={{ color: ORANGE }}>{totalCoinsWagered} coins</div>
                      </CardContent>
                    </Card>
                    <Card style={{ backgroundColor: '#1e293b', border: `2px solid #6b7280` }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold" style={{ color: '#ffffff' }}>House Edge</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold" style={{ color: '#6b7280' }}>{totalCoinsWagered - totalWinnings} coins</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Participant Betting Distribution */}
        <Card style={{ backgroundColor: '#1e293b', border: `3px solid ${ORANGE}` }}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold" style={{ color: '#ffffff' }}>Participant Betting Distribution</CardTitle>
            <CardDescription className="text-xl font-medium" style={{ color: '#d1d5db' }}>
              Overview of bets and coins wagered per participant.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedPlayerStats.length > 0 ? (
              sortedPlayerStats.map((player) => {
                return (
                  <div key={player.id} className="flex flex-col gap-3 p-4 rounded-lg border-2" style={{ borderColor: ORANGE, backgroundColor: '#1a1a1a' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg" style={{ color: '#ffffff' }}>{player.name}</span>
                        <Badge variant="outline" style={{ borderColor: ORANGE, color: ORANGE, backgroundColor: '#2a2a2a', fontWeight: 'bold' }}>{player.odds}x</Badge>
                      </div>
                      <div className="text-base font-semibold" style={{ color: '#ffffff' }}>
                        <span className="font-bold">{player.totalCoins} coins</span> <span style={{ color: ORANGE }}>({player.percentageOfTotalCoins}%)</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-600 rounded-full h-6 border-2" style={{ borderColor: '#4b5563' }}>
                        <div 
                          className="h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                          style={{ 
                            width: `${player.percentageOfTotalCoins}%`,
                            background: `linear-gradient(90deg, ${ORANGE}, #fbbf24)`,
                            minWidth: player.percentageOfTotalCoins > 0 ? '20px' : '0px'
                          }}
                        >
                          {player.percentageOfTotalCoins > 15 && (
                            <span className="text-xs font-bold text-black">
                              {player.percentageOfTotalCoins}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-base font-bold" style={{ color: '#ffffff' }}>
                        {player.totalBets} bets placed
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-xl font-semibold" style={{ color: '#ffffff' }}>
                No bets placed yet for this race.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}