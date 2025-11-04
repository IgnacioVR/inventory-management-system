"use client"

/**
 * Custom hook for managing inventory state and operations
 */

import { useState, useCallback } from "react"
import type { InventoryItem, DialogType } from "@/types/inventory.types"

interface UseInventoryReturn {
  items: InventoryItem[]
  selectedItem: InventoryItem | null
  dialogOpen: DialogType
  setItems: (items: InventoryItem[]) => void
  setSelectedItem: (item: InventoryItem | null) => void
  setDialogOpen: (type: DialogType) => void
  handleImport: (newItems: InventoryItem[]) => void
  handleEdit: (updatedItem: InventoryItem) => void
  handleDelete: () => void
  handleUpdateSchema: (updatedItems: InventoryItem[]) => void
  openDialog: (type: "edit" | "detail" | "delete", item: InventoryItem) => void
}

export function useInventory(initialItems: InventoryItem[] = []): UseInventoryReturn {
  const [items, setItems] = useState<InventoryItem[]>(initialItems)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState<DialogType>(null)

  const handleImport = useCallback((newItems: InventoryItem[]) => {
    setItems(newItems)
    setDialogOpen(null)
  }, [])

  const handleEdit = useCallback((updatedItem: InventoryItem) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setDialogOpen(null)
    setSelectedItem(null)
  }, [])

  const handleDelete = useCallback(() => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== selectedItem?.id))
    setDialogOpen(null)
    setSelectedItem(null)
  }, [selectedItem])

  const handleUpdateSchema = useCallback((updatedItems: InventoryItem[]) => {
    setItems(updatedItems)
    setDialogOpen(null)
  }, [])

  const openDialog = useCallback((type: "edit" | "detail" | "delete", item: InventoryItem) => {
    setSelectedItem(item)
    setDialogOpen(type)
  }, [])

  return {
    items,
    selectedItem,
    dialogOpen,
    setItems,
    setSelectedItem,
    setDialogOpen,
    handleImport,
    handleEdit,
    handleDelete,
    handleUpdateSchema,
    openDialog,
  }
}
