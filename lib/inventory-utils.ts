/**
 * Utility functions for inventory management
 */

import type { InventoryItem, StatusVariant } from "@/types/inventory.types"

export function getStatusVariant(status: string): StatusVariant {
  const statusLower = status?.toLowerCase() || ""

  if (statusLower.includes("stock") && !statusLower.includes("bajo")) {
    return "success"
  }

  if (statusLower.includes("bajo")) {
    return "warning"
  }

  return "default"
}

export function getStatusColor(status: string): string {
  const statusLower = status?.toLowerCase() || ""

  if (statusLower.includes("stock") && !statusLower.includes("bajo")) {
    return "bg-accent text-accent-foreground"
  }

  if (statusLower.includes("bajo")) {
    return "bg-destructive/20 text-destructive"
  }

  return "bg-secondary text-secondary-foreground"
}

export function formatPrice(price: any): string {
  if (price === undefined || price === null) return "-"

  const numericPrice = typeof price === "number" ? price : Number.parseFloat(price)

  if (isNaN(numericPrice)) return String(price)

  return `$${numericPrice.toFixed(2)}`
}

export function generateItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function normalizeImportedData(jsonData: any): InventoryItem[] {
  const items = Array.isArray(jsonData) ? jsonData : [jsonData]

  return items.map((item, index) => ({
    ...item,
    id: item.id || `imported-${Date.now()}-${index}`,
  }))
}

export function extractItemKeys(items: InventoryItem[]): string[] {
  if (items.length === 0) return []

  return Array.from(new Set(items.flatMap((item) => Object.keys(item)))).filter((key) => key !== "id")
}

export function formatKeyLabel(key: string): string {
  return (
    key.charAt(0).toUpperCase() +
    key
      .slice(1)
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
  )
}

export function applySchemaChanges(
  items: InventoryItem[],
  newFields: Array<{ name: string; defaultValue: string }>,
): InventoryItem[] {
  return items.map((item) => {
    const updatedItem = { ...item }

    newFields.forEach((field) => {
      if (!(field.name in updatedItem)) {
        updatedItem[field.name] = field.defaultValue
      }
    })

    return updatedItem
  })
}
