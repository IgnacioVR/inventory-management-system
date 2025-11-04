/**
 * Core type definitions for the inventory management system
 */

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  price: number
  status: string
  supplier: string
  lastUpdated: string
  [key: string]: any
}

export type ViewMode = "cards" | "table"

export type DialogType = "import" | "edit" | "detail" | "delete" | "schema" | null

export type StatusVariant = "default" | "success" | "warning" | "destructive"
