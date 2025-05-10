"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { 
  updateRaceStatusAction, 
  setRaceWinnerAction, 
  setRaceSecondPlaceAction,
  setRaceThirdPlaceAction,
  settleRaceAction, 
  deleteRaceAction 
} from "@/lib/actions"
import { useRouter } from "next/navigation"
import type { Race, Player } from "@/lib/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash, Trophy, Award, Medal } from "lucide-react"
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
  const [selectedSecondPlace, setSelectedSecondPlace] = useState<string>(race.secondPlaceId || "")
  const [selectedThirdPlace, setSelectedThirdPlace] = useState<string>(race.thirdPlaceId || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Set Aneta as the default winner when the component mounts
  useEffect(() => {
    if (anetaPlayerId && !race.winnerId) {
      setSelectedWinner(anetaPlayerId)
    }
  }, [anetaPlayerId, race.winnerId])

  // Update selected places when race data changes
  useEffect(() => {
    if (race.winnerId) {
      setSelectedWinner(race.winnerId)
    }
    if (race.secondPlaceId) {
      setSelectedSecondPlace(race.secondPlaceId)
    }
    if (race.thirdPlaceId) {
      setSelectedThirdPlace(race.thirdPlaceId)
    }
  }, [race.winnerId, race.secondPlaceId, race.thirdPlaceId])

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

    // Check if selected winner is the same as second or third place
    if (selectedWinner === selectedSecondPlace || selectedWinner === selectedThirdPlace) {
      toast({
        title: "Invalid selection",
        description: "The same player cannot be in multiple positions",
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

  const handleSetSecondPlace = async () => {
    if (!selectedSecondPlace) {
      toast({
        title: "No second place selected",
        description: "Please select a second place",
        variant: "destructive",
      })
      return
    }

    // Check if selected second place is the same as winner or third place
    if (selectedSecondPlace === selectedWinner || selectedSecondPlace === selectedThirdPlace) {
      toast({
        title: "Invalid selection",
        description: "The same player cannot be in multiple positions",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await setRaceSecondPlaceAction(race.id, selectedSecondPlace)

      if (result.success) {
        toast({
          title: "Second place set successfully",
        })
        router.refresh()
      } else {
        toast({
          title: "Error setting second place",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error setting second place",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetThirdPlace = async () => {
    if (!selectedThirdPlace) {
      toast({
        title: "No third place selected",
        description: "Please select a third place",
        variant: "destructive",
      })
      return
    }

    // Check if selected third place is the same as winner or second place
    if (selectedThirdPlace === selectedWinner || selectedThirdPlace === selectedSecondPlace) {
      toast({
        title: "Invalid selection",
        description: "The same player cannot be in multiple positions",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await setRaceThirdPlaceAction(race.id, selectedThirdPlace)

      if (result.success) {
        toast({
          title: "Third place set successfully",
        })
        router.refresh()
      } else {
        toast({
          title: "Error setting third place",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error setting third place",
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

    if (!race.secondPlaceId) {
      toast({
        title: "No second place set",
        description: "Please set a second place before settling the race",
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

  // Helper to check if a player is already placed in a position
  const isPlayerPlaced = (playerId: string): boolean => {
    if (race.winnerId === playerId) return true;
    if (race.secondPlaceId === playerId) return true;
    if (race.thirdPlaceId === playerId) return true;
    return false;
  }

  // Helper to get placement text and icon
  const getPlacementInfo = (playerId: string) => {
    if (race.winnerId === playerId) 
      return { text: "Winner (1st)", icon: <Trophy className="h-4 w-4" /> };
    if (race.secondPlaceId === playerId) 
      return { text: "2nd Place", icon: <Medal className="h-4 w-4" /> };
    if (race.thirdPlaceId === playerId) 
      return { text: "3rd Place", icon: <Award className="h-4 w-4" /> };
    return null;
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
                This race is open for betting. Set the places and then settle the race when all bets are placed.
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-semibold mb-2">Race Standings</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">1st Place:</span>
                    <span>{players.find(p => p.id === race.winnerId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">2nd Place:</span>
                    <span>{players.find(p => p.id === race.secondPlaceId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-700" />
                    <span className="font-medium">3rd Place:</span>
                    <span>{players.find(p => p.id === race.thirdPlaceId)?.name || 'Not set (optional)'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* First Place Selector */}
                <div className="space-y-3">
                  <div className="font-medium flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Select 1st Place Winner</span>
                  </div>
                  <RadioGroup value={selectedWinner} onValueChange={setSelectedWinner}>
                    {players.map((player) => {
                      const isWinner = race.winnerId === player.id;
                      const isSelected = selectedWinner === player.id;
                      const placement = getPlacementInfo(player.id);
                      
                      return (
                        <div 
                          key={`first-${player.id}`} 
                          className={`flex items-center space-x-2 border p-3 rounded-md transition-all ${
                            isWinner 
                              ? "border-yellow-500 bg-yellow-50 shadow-sm" 
                              : isSelected 
                                ? "border-blue-400 bg-blue-50" 
                                : placement ? "opacity-50" : ""
                          }`}
                        >
                          <RadioGroupItem 
                            value={player.id} 
                            id={`first-${player.id}`} 
                            disabled={placement && !isWinner ? true : undefined}
                          />
                          <Label 
                            htmlFor={`first-${player.id}`} 
                            className="font-medium cursor-pointer flex items-center gap-2 flex-1"
                          >
                            {player.name} ({player.odds}x)
                            {placement && (
                              <span className={`ml-auto flex items-center font-semibold gap-1 ${
                                isWinner ? "text-yellow-600" : "text-gray-500"
                              }`}>
                                {placement.icon}
                                {placement.text}
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <Button 
                    onClick={handleSetWinner} 
                    size="sm"
                    disabled={isSubmitting || !selectedWinner}
                    className="ml-auto"
                  >
                    Set 1st Place
                  </Button>
                </div>

                {/* Second Place Selector */}
                <div className="space-y-3">
                  <div className="font-medium flex items-center gap-2">
                    <Medal className="h-5 w-5 text-gray-400" />
                    <span>Select 2nd Place</span>
                  </div>
                  <RadioGroup value={selectedSecondPlace} onValueChange={setSelectedSecondPlace}>
                    {players.map((player) => {
                      const isSecondPlace = race.secondPlaceId === player.id;
                      const isSelected = selectedSecondPlace === player.id;
                      const placement = getPlacementInfo(player.id);
                      
                      return (
                        <div 
                          key={`second-${player.id}`} 
                          className={`flex items-center space-x-2 border p-3 rounded-md transition-all ${
                            isSecondPlace 
                              ? "border-gray-400 bg-gray-50 shadow-sm" 
                              : isSelected 
                                ? "border-blue-400 bg-blue-50" 
                                : placement ? "opacity-50" : ""
                          }`}
                        >
                          <RadioGroupItem 
                            value={player.id} 
                            id={`second-${player.id}`}
                            disabled={placement && !isSecondPlace ? true : undefined}
                          />
                          <Label 
                            htmlFor={`second-${player.id}`} 
                            className="font-medium cursor-pointer flex items-center gap-2 flex-1"
                          >
                            {player.name} ({player.odds}x)
                            {placement && (
                              <span className={`ml-auto flex items-center font-semibold gap-1 ${
                                isSecondPlace ? "text-gray-600" : "text-gray-500"
                              }`}>
                                {placement.icon}
                                {placement.text}
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <Button 
                    onClick={handleSetSecondPlace} 
                    size="sm"
                    disabled={isSubmitting || !selectedSecondPlace}
                    className="ml-auto"
                  >
                    Set 2nd Place
                  </Button>
                </div>

                {/* Third Place Selector */}
                <div className="space-y-3">
                  <div className="font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-700" />
                    <span>Select 3rd Place (Optional)</span>
                  </div>
                  <RadioGroup value={selectedThirdPlace} onValueChange={setSelectedThirdPlace}>
                    {players.map((player) => {
                      const isThirdPlace = race.thirdPlaceId === player.id;
                      const isSelected = selectedThirdPlace === player.id;
                      const placement = getPlacementInfo(player.id);
                      
                      return (
                        <div 
                          key={`third-${player.id}`} 
                          className={`flex items-center space-x-2 border p-3 rounded-md transition-all ${
                            isThirdPlace 
                              ? "border-amber-500 bg-amber-50 shadow-sm" 
                              : isSelected 
                                ? "border-blue-400 bg-blue-50" 
                                : placement ? "opacity-50" : ""
                          }`}
                        >
                          <RadioGroupItem 
                            value={player.id} 
                            id={`third-${player.id}`}
                            disabled={placement && !isThirdPlace ? true : undefined}
                          />
                          <Label 
                            htmlFor={`third-${player.id}`} 
                            className="font-medium cursor-pointer flex items-center gap-2 flex-1"
                          >
                            {player.name} ({player.odds}x)
                            {placement && (
                              <span className={`ml-auto flex items-center font-semibold gap-1 ${
                                isThirdPlace ? "text-amber-600" : "text-gray-500"
                              }`}>
                                {placement.icon}
                                {placement.text}
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <Button 
                    onClick={handleSetThirdPlace} 
                    size="sm"
                    disabled={isSubmitting || !selectedThirdPlace}
                    className="ml-auto"
                  >
                    Set 3rd Place
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Racing Results</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                      <li>1st place winners receive full odds payout</li>
                      <li>2nd and 3rd place winners receive half odds payout</li>
                      <li>You must set 1st and 2nd place before settling the race</li>
                      <li>3rd place is optional</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={handleSettleRace} 
                  className="w-full"
                  disabled={isSubmitting || !race.winnerId || !race.secondPlaceId}
                >
                  Settle Race
                </Button>
              </div>
            </div>
          )}

          {race.status === "settled" && (
            <div className="space-y-4">
              <div className="text-sm">
                This race has been settled. The results were:
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">1st Place:</span>
                  <span>{players.find(p => p.id === race.winnerId)?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">2nd Place:</span>
                  <span>{players.find(p => p.id === race.secondPlaceId)?.name}</span>
                </div>
                {race.thirdPlaceId && (
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-700" />
                    <span className="font-medium">3rd Place:</span>
                    <span>{players.find(p => p.id === race.thirdPlaceId)?.name}</span>
                  </div>
                )}
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
