"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { placeBetAction } from "@/lib/actions"
import { useRouter } from "next/navigation"
import type { Race, Player } from "@/lib/types"
import Link from "next/link"
import { GREEN, ORANGE, GREY } from "@/app/constants"

export default function PlaceBetForm({
  race,
  players,
}: {
  race: Race
  players: Player[]
}) {
  const { user, updateUserBalance } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [selectedPlayer, setSelectedPlayer] = useState<string>("")
  const [betAmount, setBetAmount] = useState<string>("10")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to log in to place a bet",
        variant: "destructive",
      })
      return
    }

    if (!selectedPlayer) {
      toast({
        title: "No player selected",
        description: "Please select a player to bet on",
        variant: "destructive",
      })
      return
    }

    const betAmountNumber = Number(betAmount)
    if (betAmountNumber <= 0 || betAmountNumber > user.balance) {
      toast({
        title: "Invalid bet amount",
        description: `Please enter an amount between 1 and ${user.balance} coins`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await placeBetAction(user.id, race.id, selectedPlayer, betAmountNumber)

      if (result.success) {
        // Update user balance in context and localStorage
        const newBalance = user.balance - betAmountNumber;
        updateUserBalance(newBalance);
        
        toast({
          title: "Bet placed successfully!",
          description: `You bet ${betAmountNumber} coins on this race`,
        })

        // Refresh the page to show updated data
        router.refresh()
      } else {
        toast({
          title: "Error placing bet",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error placing bet",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (race.status !== "open") {
    return (
      <Card>
        <CardHeader>
          <CardTitle style={{ color: ORANGE }}>Place a Bet</CardTitle>
          <CardDescription style={{ color: GREY }}>
            THIS RACE IS <span style={{ color: ORANGE, fontWeight: 'bold' }}>NOT</span> OPEN FOR BETTING YET
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p style={{ color: GREY }}>You can place bets once the race is open for betting.</p>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Place a Bet</CardTitle>
          <CardDescription>You need to be logged in to place bets</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button>Log in to place bets</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: ORANGE }}>Place a Bet</CardTitle>
        <CardDescription style={{ color: GREY }}>Select a participant and enter your bet amount</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label style={{ color: GREY }}>Select a participant</Label>
              <RadioGroup value={selectedPlayer} onValueChange={setSelectedPlayer} className="mt-2">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={player.id} id={player.id} />
                      <Label htmlFor={player.id} className="font-medium cursor-pointer" style={{ color: GREY }}>
                        {player.name}
                      </Label>
                    </div>
                    <div className="text-sm font-semibold" style={{ color: ORANGE }}>{player.odds}x</div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="betAmount" style={{ color: GREY }}>Bet amount (coins)</Label>
              <Input
                id="betAmount"
                type="number"
                min={1}
                max={user.balance}
                value={betAmount}
                onChange={(e) => {
                  let val = e.target.value;
                  // Remove leading zeros unless the value is exactly '0'
                  if (val.length > 1 && val.startsWith('0')) {
                    val = val.replace(/^0+/, '');
                  }
                  setBetAmount(val);
                }}
                style={{ color: "#000" }}
              />
              <div className="text-sm" style={{ color: GREY }}>Your balance: {user.balance} coins</div>
            </div>

            {selectedPlayer && (
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm" style={{ color: "#000" }}>Potential winnings:</div>
                <div className="font-semibold" style={{ color: ORANGE }}>
                  {Number(betAmount) * (players.find((p) => p.id === selectedPlayer)?.odds || 0)} coins
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            style={{ background: GREEN, borderColor: GREEN, color: '#fff' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Bet..." : "Place Bet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
