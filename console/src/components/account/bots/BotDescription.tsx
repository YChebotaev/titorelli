"use client"

import { useState, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface BotDescriptionProps {
  description: string
}

export default function BotDescription({ description }: BotDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  const truncatedDescription = description.length > 50 ? `${description.slice(0, 50)}...` : description

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className="cursor-pointer"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {truncatedDescription}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {description}
      </PopoverContent>
    </Popover>
  )
}

