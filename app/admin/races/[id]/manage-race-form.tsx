"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { updateRaceStatusAction, setRaceWinnerAction, settleRaceAction, deleteRaceAction } from "@/lib/actions"
import { useRouter } from "next/navigation"
import type { Race, Player } from "@/lib/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ManageRaceForm({
  race,
  players,
}: {
  race: Race
  players: Player[]
}) {
  const { toast } = useToast()
  const router = useRouter()

  // Find Aneta's player ID
  const anetaPlayer = players.find((player) => player.name === "Aneta")
  const anetaPlayerId = anetaPlayer?.id || ""

  const [selectedWinner, setSelectedWinner] = useState<string>(race.winnerId || anetaPlayerId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Set Aneta as the default winner when the component mounts
  useEffect(() => {
    if (anetaPlayerId && !race.winnerId) {
      setSelectedWinner(anetaPlayerId)
    }
  }, [anetaPlayerId, race.winnerId])

  const handleOpenRace = async () => {
    setIsSubmitting(true)

    try {
      const result = await updateRaceStatusAction(race.id, "open")

      if (result.success) {
        toast({
          title: "Race opened for betting",
        })
        router.refresh()
      } else {
        toast({
          title: "Error opening race",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error opening race",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetWinner = async () => {
    if (!selectedWinner) {
      toast({
        title: "No winner selected",
        description: "Please select a winner",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await setRaceWinnerAction(race.id, selectedWinner)

      if (result.success) {
        toast({
          title: "Winner set successfully",
          description: "You can now settle the race",
        })
        router.refresh()
      } else {
        toast({
          title: "Error setting winner",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error setting winner",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSettleRace = async () => {
    if (!race.winnerId) {
      toast({
        title: "No winner set",
        description: "Please set a winner before settling the race",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await settleRaceAction(race.id)

      if (result.success) {
        toast({
          title: "Race settled successfully",
          description: "All bets have been processed",
        })
        router.refresh()
      } else {
        toast({
          title: "Error settling race",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error settling race",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRace = async () => {
    setIsSubmitting(true)

    try {
      const result = await deleteRaceAction(race.id)

      if (result.success) {
        toast({
          title: "Race deleted successfully",
        })
        router.push("/admin")
      } else {
        toast({
          title: "Error deleting race",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
        setShowDeleteDialog(false)
      }
    } catch (error) {
      toast({
        title: "Error deleting race",
        description: "Something went wrong",
        variant: "destructive",
      })
      setShowDeleteDialog(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Manage Race</CardTitle>
            <CardDescription>Control the race status and determine the winner</CardDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isSubmitting}
            className="flex items-center gap-1"
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {players.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No participants</AlertTitle>
              <AlertDescription>Add participants to the race before opening it for betting</AlertDescription>
            </Alert>
          )}

          {race.status === "upcoming" && (
            <div className="space-y-4">
              <div className="text-sm">
                This race is currently in the setup phase. Add all participants before opening it for betting.
              </div>
              <Button onClick={handleOpenRace} className="w-full" disabled={isSubmitting || players.length === 0}>
                Open Race for Betting
              </Button>
            </div>
          )}

          {race.status === "open" && (
            <div className="space-y-6">
              <div className="text-sm">
                This race is open for betting. Set the winner and then settle the race when all bets are placed.
              </div>

              <div className="space-y-4">
                <div className="font-medium">Select Winner</div>
                <RadioGroup value={selectedWinner} onValueChange={setSelectedWinner}>
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value={player.id} id={player.id} />
                      <Label htmlFor={player.id} className="font-medium cursor-pointer">
                        {player.name} ({player.odds}x)
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={handleSetWinner} disabled={isSubmitting || !selectedWinner}>
                  Set Winner
                </Button>

                <Button onClick={handleSettleRace} variant="outline" disabled={isSubmitting || !race.winnerId}>
                  Settle Race
                </Button>
              </div>
            </div>
          )}

          {race.status === "settled" && (
            <div className="space-y-4">
              <div className="text-sm">
                This race has been settled. The winner was {players.find((p) => p.id === race.winnerId)?.name}.
              </div>
              <Button variant="outline" onClick={() => router.push(`/races/${race.id}`)} className="w-full">
                View Race Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this race?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the race "{race.name}" and all associated data.
              {race.status === "open" && (
                <div className="mt-2 text-red-500 font-medium">
                  Warning: Any unsettled bets will be refunded to users.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRace}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? "Deleting..." : "Delete Race"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
