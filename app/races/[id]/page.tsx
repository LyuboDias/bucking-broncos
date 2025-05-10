"use client"

import { useEffect, useState } from "react"
import { getRace, getPlayersForRace, getBetsForRace, getUser } from "@/lib/data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import PlaceBetForm from "./place-bet-form"
import RaceResults from "./race-results"
import AllUserBets from "./all-user-bets"
import { useAuth } from "@/components/auth-provider"
import type { Race, Player, Bet } from "@/lib/types"
import { useParams } from "next/navigation"

export default function RacePage() {
  const params = useParams()
  const { user, updateUserBalance } = useAuth()
  const [race, setRace] = useState<Race | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [winner, setWinner] = useState<Player | null>(null)
  
  // Convert user ID to string for consistent comparison
  const userIdStr = user?.id ? String(user.id) : undefined
  
  // Log user data for debugging
  useEffect(() => {
    console.log("RacePage - Current user:", user);
    console.log("RacePage - User ID as string:", userIdStr);
  }, [user, userIdStr]);
  
  // Check if we need to update the user's balance due to a settled race
  useEffect(() => {
    async function syncUserBalance() {
      if (!user || !race) return;
      
      console.log("Checking if balance sync is needed - Race status:", race.status);
      
      // Only sync balance for races that are settled
      if (race.status === "settled") {
        try {
          console.log("Race is settled, fetching latest user data to sync balance");
          // Fetch the latest user data from server
          const userData = await getUser(user.id);
          if (userData && userData.balance !== user.balance) {
            console.log("Updating user balance from", user.balance, "to", userData.balance);
            updateUserBalance(userData.balance);
          } else {
            console.log("No balance update needed - current:", user.balance, "server:", userData?.balance);
          }
        } catch (error) {
          console.error("Error syncing user balance:", error);
        }
      }
    }
    
    syncUserBalance();
  }, [race, user, updateUserBalance, bets]);
  
  useEffect(() => {
    async function loadData() {
      try {
        // Get the id from params
        const id = params.id as string
        
        const raceData = await getRace(id)
        
        if (!raceData) {
          return notFound()
        }
        
        const playersData = await getPlayersForRace(raceData.id)
        const betsData = await getBetsForRace(raceData.id)
        
        console.log("RacePage - Loaded bets:", betsData.length, "for race ID:", raceData.id);
        if (userIdStr) {
          const userBets = betsData.filter(bet => String(bet.userId) === userIdStr);
          console.log("RacePage - User bets:", userBets.length, "for user ID:", userIdStr);
          console.log("RacePage - User bet details:", userBets);
        }
        
        setRace(raceData)
        setPlayers(playersData)
        setBets(betsData)
        
        // Set winner if exists
        if (raceData.winnerId) {
          const winnerPlayer = playersData.find((player) => player.id === raceData.winnerId) || null
          setWinner(winnerPlayer)
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error loading race data:", error)
        setLoading(false)
      }
    }
    
    if (params.id) {
      loadData()
    }
  }, [params, userIdStr])
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading race details...</div>
  }
  
  if (!race) {
    return notFound()
  }

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{race.name}</h1>
          <p className="text-muted-foreground">
            Created on {new Date(race.createdAt).toLocaleDateString()}
            {race.settledAt && ` • Settled on ${new Date(race.settledAt).toLocaleDateString()}`}
          </p>
          <div>
            <StatusBadge status={race.status} />
          </div>
        </div>
      </div>

      {race.status === "settled" ? (
        <div className="w-full space-y-8">
          <RaceResults race={race} players={players} bets={bets} winner={winner} />
          <AllUserBets bets={bets} players={players} userId={userIdStr} />
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
          <PlaceBetForm race={race} players={players} />
          {bets.length > 0 && <AllUserBets bets={bets} players={players} userId={userIdStr} />}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "upcoming":
      return (
        <Badge
          variant="outline"
          className="border-amber-400 text-amber-700 bg-amber-50"
        >
          Upcoming
        </Badge>
      )
    case "open":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
          Open for Betting
        </Badge>
      )
    case "settled":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Settled
        </Badge>
      )
    default:
      return null
  }
}
