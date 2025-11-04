"use client"

/**
 * Dialog component for confirming deletion of an inventory item
 * @module components/dialogs/delete-dialog
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertTriangle } from "lucide-react"
import type { InventoryItem } from "@/types/inventory.types"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem
  onConfirm: () => void
}

export function DeleteDialog({ open, onOpenChange, item, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Eliminar Producto
          </DialogTitle>
          <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>¿Estás seguro de que deseas eliminar este producto?</AlertDescription>
        </Alert>

        <div className="p-4 bg-muted rounded-lg">
          <p className="font-semibold text-lg">{item.name || "Producto sin nombre"}</p>
          {item.category && <p className="text-sm text-muted-foreground mt-1">{item.category}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
