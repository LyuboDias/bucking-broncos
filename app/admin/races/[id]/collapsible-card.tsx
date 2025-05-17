"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

type CollapsibleCardProps = {
  title: string
  description: string
  children: React.ReactNode
  titleColor?: string
  descriptionColor?: string
}

export default function CollapsibleCard({ 
  title, 
  description, 
  children,
  titleColor = "#000", 
  descriptionColor = "#666"
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader 
        className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <CardTitle style={{ color: titleColor }}>{title}</CardTitle>
          <CardDescription style={{ color: descriptionColor }}>{description}</CardDescription>
        </div>
        <div className="rounded-full hover:bg-gray-100 p-1 transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" style={{ color: titleColor }} />
          ) : (
            <ChevronDown className="h-4 w-4" style={{ color: titleColor }} />
          )}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  )
} 