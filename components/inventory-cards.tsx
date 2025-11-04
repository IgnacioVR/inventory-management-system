/**
 * Grid view component for displaying inventory items as cards
 * @module components/inventory-cards
 */

import { InventoryCardItem } from "@/components/inventory/inventory-card-item"
import type { InventoryItem } from "@/types/inventory.types"

interface InventoryCardsProps {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDetail: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
}

export function InventoryCards({ items, onEdit, onDetail, onDelete }: InventoryCardsProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay productos en el inventario</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <InventoryCardItem key={item.id} item={item} onEdit={onEdit} onDetail={onDetail} onDelete={onDelete} />
      ))}
    </div>
  )
}
