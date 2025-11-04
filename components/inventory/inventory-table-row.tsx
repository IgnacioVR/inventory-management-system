"use client"

/**
 * Individual table row component for displaying a single inventory item
 * @module components/inventory/inventory-table-row
 */

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { getStatusColor, formatPrice } from "@/lib/inventory-utils"
import type { InventoryItem } from "@/types/inventory.types"

interface InventoryTableRowProps {
  item: InventoryItem
  columns: string[]
  onEdit: (item: InventoryItem) => void
  onDetail: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
}

export function InventoryTableRow({ item, columns, onEdit, onDetail, onDelete }: InventoryTableRowProps) {
  const renderCellContent = (key: string, value: any) => {
    if (key === "status" && value) {
      return (
        <Badge className={getStatusColor(value)} variant="secondary">
          {value}
        </Badge>
      )
    }

    if (key === "price" && value !== undefined) {
      return <span className="font-medium text-primary">{formatPrice(value)}</span>
    }

    return <span>{value !== undefined ? String(value) : "-"}</span>
  }

  return (
    <TableRow className="hover:bg-muted/30">
      {columns.map((key) => (
        <TableCell key={key}>{renderCellContent(key, item[key])}</TableCell>
      ))}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onDetail(item)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
