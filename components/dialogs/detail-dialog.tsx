/**
 * Dialog component for viewing detailed information about an inventory item
 * @module components/dialogs/detail-dialog
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { getStatusColor, formatPrice, formatKeyLabel } from "@/lib/inventory-utils"
import type { InventoryItem } from "@/types/inventory.types"

interface DetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem
}

export function DetailDialog({ open, onOpenChange, item }: DetailDialogProps) {
  const renderValue = (key: string, value: any) => {
    if (key === "status" && value) {
      return (
        <Badge className={getStatusColor(String(value))} variant="secondary">
          {String(value)}
        </Badge>
      )
    }

    if (key === "price" && value !== undefined) {
      return <span className="font-semibold text-primary text-lg">{formatPrice(value)}</span>
    }

    return <span className="text-foreground">{value !== undefined && value !== null ? String(value) : "-"}</span>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Detalles del Producto
          </DialogTitle>
          <DialogDescription>Información completa del producto seleccionado.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {Object.entries(item)
            .filter(([key]) => key !== "id")
            .map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-muted/50">
                <span className="font-semibold text-sm uppercase tracking-wide text-muted-foreground min-w-[140px]">
                  {formatKeyLabel(key)}:
                </span>
                <span className="flex-1">{renderValue(key, value)}</span>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
