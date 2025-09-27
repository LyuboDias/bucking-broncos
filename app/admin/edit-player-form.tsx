"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { updateUserAction, deleteUserAction } from "@/lib/actions"
import type { User } from "@/lib/types"
import { ORANGE, GREY, GREEN, RED } from "@/app/constants"

type EditPlayerFormProps = {
  user: User
  onCancel: () => void
  onSuccess: () => void
}

export default function EditPlayerForm({ user, onCancel, onSuccess }: EditPlayerFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    balance: user.balance.toString(),
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updates: { name?: string; balance?: number; password?: string } = {}
      
      // Only include changed fields
      if (formData.name !== user.name) {
        updates.name = formData.name
      }
      
      const newBalance = parseInt(formData.balance, 10)
      if (!isNaN(newBalance) && newBalance !== user.balance) {
        updates.balance = newBalance
      }
      
      if (formData.password.trim()) {
        updates.password = formData.password
      }

      // Only update if there are changes
      if (Object.keys(updates).length === 0) {
        toast({
          title: "No changes detected",
          description: "Please make changes before saving",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const result = await updateUserAction(user.id, updates)

      if (result.success) {
        toast({
          title: "Player updated successfully",
          description: `Updated ${user.name}'s information`,
        })
        onSuccess()
      } else {
        toast({
          title: "Error updating player",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error updating player",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteUserAction(user.id)

      if (result.success) {
        toast({
          title: "Player deleted successfully",
          description: `${user.name} and all their bets have been removed`,
        })
        onSuccess()
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
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: ORANGE }}>Edit Player: {user.name}</CardTitle>
        <CardDescription className="text-lg" style={{ color: GREY }}>Update player information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="p-2 bg-gray-50 rounded-md border text-sm text-gray-700">
              {user.username || 'No username set'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Player Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Coins Balance</Label>
            <Input
              id="balance"
              type="number"
              min="0"
              value={formData.balance}
              onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
              required
              style={{ color: "#000" }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password (optional)</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Leave empty to keep current password"
            />
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || isDeleting}
                style={{ background: GREEN, color: '#fff' }}
                className="flex-1"
              >
                {isSubmitting ? "Updating..." : "Update Player"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isDeleting}
                className="flex-1"
                style={{ color: "#000" }}
              >
                Cancel
              </Button>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || isDeleting}
                  className="w-full"
                  style={{ borderColor: RED, color: RED }}
                >
                  {isDeleting ? "Deleting..." : "Delete Player"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Player: {user.name}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this player? This action cannot be undone.
                    <br /><br />
                    <strong>Warning:</strong> All bets placed by this player will also be permanently deleted to maintain data integrity.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{ background: RED, color: '#fff' }}
                  >
                    {isDeleting ? "Deleting..." : "Delete Player"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
