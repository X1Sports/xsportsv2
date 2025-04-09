"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Ensure options and selected are arrays
  const safeOptions = Array.isArray(options) ? options : []
  const safeSelected = Array.isArray(selected) ? selected : []

  const handleUnselect = (option: string) => {
    onChange(safeSelected.filter((s) => s !== option))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && safeSelected.length > 0) {
          onChange(safeSelected.slice(0, -1))
        }
      }
      // This is not a default behavior of the <input /> field
      if (e.key === "Escape") {
        input.blur()
      }
    }
  }

  // Filter out already selected options
  const selectables = safeOptions.filter((option) => !safeSelected.includes(option.value))

  return (
    <div className={`border border-input rounded-md w-full ${className}`} onKeyDown={handleKeyDown}>
      <div className="flex flex-wrap gap-1 p-1">
        {safeSelected.map((option) => {
          const selectedOption = safeOptions.find((o) => o.value === option)
          return (
            <Badge key={option} variant="secondary" className="rounded-sm px-1 py-0">
              {selectedOption?.label || option}
              <button
                type="button"
                className="ml-1 rounded-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          )
        })}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false)
            }, 200)
            setInputValue("")
          }}
          className="flex-1 bg-transparent px-1 py-1 outline-none text-sm placeholder:text-muted-foreground"
          placeholder={safeSelected.length === 0 ? placeholder : undefined}
        />
      </div>

      {open && selectables.length > 0 && (
        <div className="border-t border-border mt-1">
          <div className="max-h-[200px] overflow-auto p-1">
            {selectables.map((option) => (
              <div
                key={option.value}
                className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange([...safeSelected, option.value])
                  setInputValue("")
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
