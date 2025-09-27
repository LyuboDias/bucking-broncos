"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ChevronDown, ChevronUp, Search, Edit, User, Coins, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { searchUsers, getUsers } from "@/lib/data"
import { deleteUserAction } from "@/lib/actions"
import type { User } from "@/lib/types"
import EditPlayerForm from "./edit-player-form"
import { ORANGE, GREY, GREEN, RED } from "@/app/constants"

export default function ManagePlayersPanel() {
  const { toast } = useToast()
  const [isExpanded, setIsExpanded] = useState(false)
  const [players, setPlayers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPlayer, setEditingPlayer] = useState<User | null>(null)
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null)

  const loadPlayers = async (search: string = "") => {
    setLoading(true)
    try {
      let result: User[]
      if (search.trim()) {
        result = await searchUsers(search.trim(), 10, 0)
      } else {
        // Get first 10 users when no search term
        const allUsers = await getUsers()
        result = allUsers.slice(0, 10)
      }
      setPlayers(result)
    } catch (error) {
      console.error("Error loading players:", error)
      setPlayers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isExpanded) {
      loadPlayers(searchTerm)
    }
  }, [isExpanded, searchTerm])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleEditPlayer = (player: User) => {
    setEditingPlayer(player)
  }

  const handleEditSuccess = () => {
    setEditingPlayer(null)
    loadPlayers(searchTerm) // Reload the list
  }

  const handleEditCancel = () => {
    setEditingPlayer(null)
  }

  const handleDeletePlayer = async (player: User) => {
    setDeletingPlayerId(player.id)

    try {
      const result = await deleteUserAction(player.id)

      if (result.success) {
        toast({
          title: "Player deleted successfully",
          description: `${player.name} and all their bets have been removed`,
        })
        loadPlayers(searchTerm) // Reload the list
      } else {
        toast({
          title: "Error deleting player",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error deleting player",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setDeletingPlayerId(null)
    }
  }

  if (editingPlayer) {
    return (
      <EditPlayerForm
        user={editingPlayer}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
      />
    )
  }

  return (
    <Card>
      <CardHeader 
        className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <CardTitle className="text-4xl" style={{ color: ORANGE }}>Manage Players</CardTitle>
          <CardDescription className="text-2xl" style={{ color: GREY }}>Edit player information, coins, and passwords</CardDescription>
        </div>
        <div className="rounded-full hover:bg-gray-100 p-1 transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" style={{ color: ORANGE }} />
          ) : (
            <ChevronDown className="h-4 w-4" style={{ color: ORANGE }} />
          )}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="space-y-2">
              <Label htmlFor="playerSearch">Search Players</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="playerSearch"
                  type="text"
                  placeholder="Search by player name..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-4" style={{ color: GREY }}>
                  Loading players...
                </div>
              ) : players.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                          <User className="h-4 w-4" style={{ color: ORANGE }} />
                        </div>
                        <div>
                          <div className="font-medium" style={{ color: "#000" }}>
                            {player.name}
                            {player.isAdmin && (
                              <span className="ml-2 text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-xs" style={{ color: GREY }}>
                            {player.username || 'No username'}
                          </div>
                          <div className="text-sm flex items-center gap-1" style={{ color: "#000" }}>
                            <Coins className="h-3 w-3" />
                            {player.balance} coins
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPlayer(player)}
                          className="flex items-center gap-1"
                          style={{ borderColor: ORANGE, color: ORANGE }}
                          disabled={deletingPlayerId === player.id}
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                              style={{ borderColor: RED, color: RED }}
                              disabled={deletingPlayerId === player.id}
                            >
                              <Trash2 className="h-3 w-3" />
                              {deletingPlayerId === player.id ? "..." : "Delete"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Player: {player.name}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this player? This action cannot be undone.
                                <br /><br />
                                <strong>Warning:</strong> All bets placed by this player will also be permanently deleted to maintain data integrity.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={deletingPlayerId === player.id}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePlayer(player)}
                                disabled={deletingPlayerId === player.id}
                                style={{ background: RED, color: '#fff' }}
                              >
                                {deletingPlayerId === player.id ? "Deleting..." : "Delete Player"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: GREY }}>
                  {searchTerm ? `No players found matching "${searchTerm}"` : "No players found"}
                </div>
              )}
            </div>

            {players.length === 10 && (
              <div className="text-center text-sm" style={{ color: GREY }}>
                Showing first 10 results. Use search to find specific players.
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
