"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { GREEN } from "@/app/constants"

export default function CreateRaceButton() {
  return (
    <Button
      size="sm"
      onClick={() => {
        // Focus the race name input in the form
        const inputElement = document.querySelector('input[name="raceName"]') as HTMLInputElement;
        if (inputElement) inputElement.focus();
      }}
      style={{ background: GREEN, color: '#fff' }}
      className="flex items-center gap-1 mx-auto"
    >
      <PlusCircle className="h-4 w-4 mr-1" />
      Create Your First Race
    </Button>
  )
}

