"use client"

/**
 * Custom hook for managing view mode state
 */

import { useState, useCallback } from "react"
import type { ViewMode } from "@/types/inventory.types"

interface UseViewModeReturn {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
}

export function useViewMode(initialMode: ViewMode = "cards"): UseViewModeReturn {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode)

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "cards" ? "table" : "cards"))
  }, [])

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
  }
}
