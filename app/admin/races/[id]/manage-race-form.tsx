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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Trash, Trophy, Award, Medal, ChevronDown, Play, Square } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import CollapsibleCard from "./collapsible-card"
import { ORANGE, GREY, GREEN, RED } from "@/app/constants"

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
  const [isReopening, setIsReopening] = useState(false)
  const [isSettling, setIsSettling] = useState(false)

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

  const handleCloseBetting = async () => {
    setIsSubmitting(true)

    try {
      const result = await updateRaceStatusAction(race.id, "close")

      if (result.success) {
        toast({
          title: "Betting closed",
          description: "Users can no longer place bets on this race",
        })
        router.refresh()
      } else {
        toast({
          title: "Error closing betting",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error closing betting",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReopenBetting = async () => {
    setIsSubmitting(true)

    try {
      const result = await updateRaceStatusAction(race.id, "open")

      if (result.success) {
        toast({
          title: "Betting reopened",
          description: "Users can now place bets on this race again",
        })
        router.refresh()
      } else {
        toast({
          title: "Error reopening betting",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error reopening betting",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReopenRace = async () => {
    setIsReopening(true)
    try {
      const result = await updateRaceStatusAction(race.id, "open")
      if (result.success) {
        toast({
          title: "Race reopened",
          description: "The race is now open for betting again",
        })
        router.refresh()
      } else {
        toast({
          title: "Error reopening race",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error reopening race",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsReopening(false)
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
          <Badge style={{ background: '#fecaca', color: '#dc2626', borderColor: '#dc2626' }}>
            Settled
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Card
        style={{ border: `3px solid ${ORANGE}`, boxShadow: 'none', outline: 'none' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-4xl" style={{ color: ORANGE }}>Manage Race</CardTitle>
              <StatusBadge status={race.status} />
            </div>
            <CardDescription className="text-2xl" style={{ color: GREY }}>Control the race status and determine the winner</CardDescription>
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
              <AlertCircle className="h-4 w-4" style={{ color: ORANGE }} />
              <AlertTitle style={{ color: ORANGE }}>No participants</AlertTitle>
              <AlertDescription style={{ color: '#000' }}>Add participants to the race before opening it for betting</AlertDescription>
            </Alert>
          )}

          {race.status === "upcoming" && (
            <div className="space-y-4">
              <div className="text-sm" style={{ color: GREY }}>
                This race is currently in the setup phase. You can set the winners and then open it for betting.
              </div>
              
              {/* Race standings summary - always visible */}
              <div className="border rounded-md p-3 bg-muted/30">
                <h3 className="font-semibold mb-2 text-sm" style={{ color: GREY }}>Race Standings</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>1st:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.winnerId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>2nd:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.secondPlaceId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-700" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>3rd:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.thirdPlaceId)?.name || 'Not set'}</span>
                  </div>
                </div>
              </div>
              
              {/* Winner Selection - collapsible */}
              <CollapsibleCard
                title="Set Winners"
                description="Select winners for 1st, 2nd, and 3rd places"
                titleColor={ORANGE}
                descriptionColor={GREY}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <Select value={selectedWinner} onValueChange={setSelectedWinner}>
                      <SelectTrigger className="h-8 text-sm" style={{ color: '#000000' }}>
                        <SelectValue placeholder="Select 1st place" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem 
                            key={`first-${player.id}`} 
                            value={player.id} 
                            disabled={(race.secondPlaceId === player.id || race.thirdPlaceId === player.id) && race.winnerId !== player.id}
                          >
                            {player.name} ({player.odds}x)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleSetWinner} 
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-xs"
                      disabled={isSubmitting || !selectedWinner}
                      style={{ borderColor: GREEN, color: GREEN }}
                    >
                      Set
                    </Button>
                  </div>

                  <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <Select value={selectedSecondPlace} onValueChange={setSelectedSecondPlace}>
                      <SelectTrigger className="h-8 text-sm" style={{ color: '#000000' }}>
                        <SelectValue placeholder="Select 2nd place" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem 
                            key={`second-${player.id}`} 
                            value={player.id} 
                            disabled={(race.winnerId === player.id || race.thirdPlaceId === player.id) && race.secondPlaceId !== player.id}
                          >
                            {player.name} ({player.odds}x)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleSetSecondPlace} 
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-xs"
                      disabled={isSubmitting || !selectedSecondPlace}
                      style={{ borderColor: GREEN, color: GREEN }}
                    >
                      Set
                    </Button>
                  </div>

                  <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
                    <Award className="h-4 w-4 text-amber-700" />
                    <Select value={selectedThirdPlace} onValueChange={setSelectedThirdPlace}>
                      <SelectTrigger className="h-8 text-sm" style={{ color: '#000000' }}>
                        <SelectValue placeholder="Select 3rd place (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem 
                            key={`third-${player.id}`} 
                            value={player.id} 
                            disabled={(race.winnerId === player.id || race.secondPlaceId === player.id) && race.thirdPlaceId !== player.id}
                          >
                            {player.name} ({player.odds}x)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleSetThirdPlace} 
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-xs"
                      disabled={isSubmitting || !selectedThirdPlace}
                      style={{ borderColor: GREEN, color: GREEN }}
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </CollapsibleCard>
              
              {/* Show warning if 1st or 2nd place is not set */}
              {(!race.winnerId || !race.secondPlaceId) && (
                <Alert variant="destructive" className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Winners required</AlertTitle>
                  <AlertDescription>
                    You must set both 1st and 2nd place winners before opening the race for betting.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={handleOpenRace} 
                className="w-full" 
                style={{ background: GREEN, color: '#fff' }} 
                disabled={isSubmitting || players.length === 0 || !race.winnerId || !race.secondPlaceId}
              >
                Open Race for Betting
              </Button>
            </div>
          )}

          {race.status === "open" && (
            <div className="space-y-4">
              <div className="text-sm" style={{ color: GREY }}>
                This race is open for betting. Winners have been set and cannot be changed.
              </div>

              {/* Race standings summary - always visible */}
              <div className="border rounded-md p-3 bg-muted/30">
                <h3 className="font-semibold mb-2 text-sm" style={{ color: GREY }}>Race Standings</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>1st:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.winnerId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>2nd:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.secondPlaceId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-700" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>3rd:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.thirdPlaceId)?.name || 'Not set'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCloseBetting} 
                  className="flex-1" 
                  variant="outline"
                  style={{ borderColor: ORANGE, color: ORANGE }}
                  disabled={isSubmitting}
                >
                  Close Betting
                </Button>
                
                {/* Settle race button only appears when 1st and 2nd place are set */}
                {race.winnerId && race.secondPlaceId && (
                  <Button 
                    onClick={handleSettleRace} 
                    className="flex-1" 
                    style={{ background: GREEN, color: '#fff' }}
                    disabled={isSubmitting}
                  >
                    Settle Race
                  </Button>
                )}
              </div>
            </div>
          )}

          {(race.status === "close" || (race.status as string) === "closed") && (
            <div className="space-y-4">
              <div className="text-sm" style={{ color: GREY }}>
                Betting is closed for this race. Winners have been set and cannot be changed.
              </div>

              {/* Race standings summary - always visible */}
              <div className="border rounded-md p-3 bg-muted/30">
                <h3 className="font-semibold mb-2 text-sm" style={{ color: GREY }}>Race Standings</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>1st:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.winnerId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>2nd:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.secondPlaceId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-700" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>3rd:</span>
                    <span className="text-sm" style={{ color: GREY }}>{players.find(p => p.id === race.thirdPlaceId)?.name || 'Not set'}</span>
                  </div>
                </div>
              </div>

              {/* Winner Selection - read-only view */}
              <CollapsibleCard
                title="View Winners"
                description="Current winners (read-only)"
                titleColor={ORANGE}
                descriptionColor={GREY}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <div className="h-8 px-3 py-1 border rounded-md bg-muted/50 flex items-center text-sm" style={{ color: GREY }}>
                      {players.find(p => p.id === race.winnerId)?.name || 'Not set'} 
                      {race.winnerId && ` (${players.find(p => p.id === race.winnerId)?.odds}x)`}
                    </div>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <div className="h-8 px-3 py-1 border rounded-md bg-muted/50 flex items-center text-sm" style={{ color: GREY }}>
                      {players.find(p => p.id === race.secondPlaceId)?.name || 'Not set'}
                      {race.secondPlaceId && ` (${players.find(p => p.id === race.secondPlaceId)?.odds}x)`}
                    </div>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <Award className="h-4 w-4 text-amber-700" />
                    <div className="h-8 px-3 py-1 border rounded-md bg-muted/50 flex items-center text-sm" style={{ color: GREY }}>
                      {players.find(p => p.id === race.thirdPlaceId)?.name || 'Not set'}
                      {race.thirdPlaceId && ` (${players.find(p => p.id === race.thirdPlaceId)?.odds}x)`}
                    </div>
                  </div>
                </div>
              </CollapsibleCard>

              <div className="flex gap-2">
                <Button 
                  onClick={handleReopenBetting} 
                  className="flex-1" 
                  variant="outline"
                  style={{ borderColor: GREEN, color: GREEN }}
                  disabled={isSubmitting}
                >
                  Re-open for betting
                </Button>
                
                {/* Settle race button only appears when 1st and 2nd place are set */}
                {race.winnerId && race.secondPlaceId && (
                  <Button 
                    onClick={handleSettleRace} 
                    className="flex-1" 
                    style={{ background: GREEN, color: '#fff' }}
                    disabled={isSubmitting}
                  >
                    Settle Race
                  </Button>
                )}
              </div>
            </div>
          )}

          {race.status === "settled" && (
            <div className="space-y-4">
              <div className="text-sm" style={{ color: GREY }}>
                This race has been settled. All winnings have been distributed to users.
              </div>

              {/* Race standings summary - always visible */}
              <div className="border rounded-md p-3 bg-muted/30">
                <h3 className="font-semibold mb-2 text-sm" style={{ color: GREY }}>Final Race Results</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>1st:</span>
                    <span className="text-sm font-semibold" style={{ color: GREY }}>{players.find(p => p.id === race.winnerId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>2nd:</span>
                    <span className="text-sm font-semibold" style={{ color: GREY }}>{players.find(p => p.id === race.secondPlaceId)?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-700" />
                    <span className="text-sm font-medium" style={{ color: GREY }}>3rd:</span>
                    <span className="text-sm font-semibold" style={{ color: GREY }}>{players.find(p => p.id === race.thirdPlaceId)?.name || 'Not set'}</span>
                  </div>
                </div>
              </div>

              {/* Winner Selection - read-only view */}
              <CollapsibleCard
                title="Final Winners"
                description="Race results (read-only)"
                titleColor={ORANGE}
                descriptionColor={GREY}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <div className="h-8 px-3 py-1 border rounded-md bg-yellow-50 flex items-center text-sm font-semibold" style={{ color: '#000' }}>
                      {players.find(p => p.id === race.winnerId)?.name || 'Not set'} 
                      {race.winnerId && ` (${players.find(p => p.id === race.winnerId)?.odds}x)`}
                    </div>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <div className="h-8 px-3 py-1 border rounded-md bg-gray-50 flex items-center text-sm font-semibold" style={{ color: '#000' }}>
                      {players.find(p => p.id === race.secondPlaceId)?.name || 'Not set'}
                      {race.secondPlaceId && ` (${players.find(p => p.id === race.secondPlaceId)?.odds}x)`}
                    </div>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                    <Award className="h-4 w-4 text-amber-700" />
                    <div className="h-8 px-3 py-1 border rounded-md bg-amber-50 flex items-center text-sm font-semibold" style={{ color: '#000' }}>
                      {players.find(p => p.id === race.thirdPlaceId)?.name || 'Not set'}
                      {race.thirdPlaceId && ` (${players.find(p => p.id === race.thirdPlaceId)?.odds}x)`}
                    </div>
                  </div>
                </div>
              </CollapsibleCard>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md" style={{ background: '#fecaca', color: '#dc2626' }}>
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold">Race Completed</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the race "{race.name}" and all related bets.
              Any unsettled bets will be refunded to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRace} 
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}