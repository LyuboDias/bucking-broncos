"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addPlayerAction } from "@/lib/actions"
import { useRouter } from "next/navigation"

export default function AddPlayerForm({ raceId }: { raceId: string }) {
  const { toast } = useToast()
  const router = useRouter()

  const [playerName, setPlayerName] = useState("")
  const [playerOdds, setPlayerOdds] = useState<number>(2)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!playerName.trim()) {
      toast({
        title: "Player name required",
        description: "Please enter a name for the player",
        variant: "destructive",
      })
      return
    }

    if (playerOdds <= 1) {
      toast({
        title: "Invalid odds",
        description: "Odds must be greater than 1",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addPlayerAction(raceId, playerName, playerOdds)

      if (result.success) {
        toast({
          title: "Player added successfully",
        })

        // Reset form
        setPlayerName("")
        setPlayerOdds(2)

        // Refresh the page to show updated data
        router.refresh()
      } else {
        toast({
          title: "Error adding player",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error adding player",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle odds change with proper validation
  const handleOddsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // If input is empty, set odds to an empty string temporarily
    if (value === '') {
      // @ts-ignore - we'll handle the validation when submitting
      setPlayerOdds('');
      return;
    }
    
    // Convert to number and update state
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setPlayerOdds(numValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Participant</CardTitle>
        <CardDescription>Add a new participant to this race</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Participant Name</Label>
            <Input
              id="playerName"
              placeholder="Enter participant name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerOdds">Odds (multiplier)</Label>
            <Input
              id="playerOdds"
              type="number"
              min="1.1"
              step="0.1"
              placeholder="2.0"
              value={playerOdds}
              onChange={handleOddsChange}
            />
            <div className="text-sm text-muted-foreground">Higher odds mean lower probability but higher payout</div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Participant"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
