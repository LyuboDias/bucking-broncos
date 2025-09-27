"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { bulkUpdateRaceStatusAction } from "@/lib/actions"
import { GREEN, ORANGE } from "@/app/constants"

interface BulkRaceButtonsProps {
  // No props needed for now
}

export default function BulkRaceButtons({}: BulkRaceButtonsProps) {
  const { toast } = useToast()
  const [isOpeningAll, setIsOpeningAll] = useState(false)
  const [isClosingAll, setIsClosingAll] = useState(false)

  const handleBulkUpdate = async (action: "open" | "close") => {
    const isOpening = action === "open"
    const setLoading = isOpening ? setIsOpeningAll : setIsClosingAll
    
    setLoading(true)
    try {
      const result = await bulkUpdateRaceStatusAction(action)
      
      if (result.success) {
        const actionText = isOpening ? "opened" : "closed"
        const message = result.updatedCount > 0 
          ? `Successfully ${actionText} ${result.updatedCount} race${result.updatedCount !== 1 ? 's' : ''}`
          : `No races were ${actionText}`
        
        let description = undefined
        if (result.skippedCount > 0 && result.skippedRaces) {
          if (result.skippedRaces.length <= 3) {
            description = `Skipped: ${result.skippedRaces.join(', ')}`
          } else {
            description = `Skipped ${result.skippedCount} races: ${result.skippedRaces.slice(0, 2).join(', ')} and ${result.skippedCount - 2} more`
          }
        }

        toast({
          title: message,
          description,
          variant: result.updatedCount > 0 ? "default" : "destructive"
        })
      } else {
        toast({
          title: `Error ${isOpening ? 'opening' : 'closing'} races`,
          description: result.error || "Something went wrong",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: `Error ${isOpening ? 'opening' : 'closing'} races`,
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => handleBulkUpdate("open")}
        disabled={isOpeningAll || isClosingAll}
        className="flex items-center gap-2"
        style={{ background: GREEN, color: '#fff' }}
      >
        <Play className="h-4 w-4" />
        {isOpeningAll ? "Opening All..." : "Open All Races"}
      </Button>
      
      <Button
        onClick={() => handleBulkUpdate("close")}
        disabled={isOpeningAll || isClosingAll}
        variant="outline"
        className="flex items-center gap-2"
        style={{ borderColor: ORANGE, color: ORANGE }}
      >
        <Pause className="h-4 w-4" />
        {isClosingAll ? "Closing All..." : "Close All Races"}
      </Button>
    </div>
  )
}
