"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createRaceAction } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { ORANGE, GREY } from "../constants"

export default function CreateRaceForm() {
  const { toast } = useToast()
  const router = useRouter()

  const [raceName, setRaceName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!raceName.trim()) {
      toast({
        title: "Race name required",
        description: "Please enter a name for the race",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createRaceAction(raceName)

      if (result.success) {
        toast({
          title: "Race created successfully",
          description: "Redirecting to admin dashboard",
        })

        // Instead of trying to navigate to the race management page,
        // just go back to the admin dashboard
        router.push("/admin")
        router.refresh()
      } else {
        toast({
          title: "Error creating race",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error creating race",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: ORANGE }}>Create New Race</CardTitle>
        <CardDescription style={{ color: GREY }}>Add a new race to the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="raceName">Race Name</Label>
            <Input
              id="raceName"
              placeholder="Bucking Broncos"
              value={raceName}
              onChange={(e) => setRaceName(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Race"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
