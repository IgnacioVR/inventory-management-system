"use client"

/**
 * Dialog component for editing an inventory item
 * @module components/dialogs/edit-dialog
 */

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { formatKeyLabel } from "@/lib/inventory-utils"
import type { InventoryItem } from "@/types/inventory.types"

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem
  onSave: (item: InventoryItem) => void
}

export function EditDialog({ open, onOpenChange, item, onSave }: EditDialogProps) {
  const [editedItem, setEditedItem] = useState<InventoryItem>(item)

  useEffect(() => {
    setEditedItem(item)
  }, [item])

  const handleSave = () => {
    onSave(editedItem)
  }

  const handleChange = (key: string, value: any) => {
    setEditedItem((prev) => ({ ...prev, [key]: value }))
  }

  const editableKeys = Object.keys(editedItem).filter((key) => key !== "id")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Editar Producto
          </DialogTitle>
          <DialogDescription>Modifica los campos del producto según sea necesario.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {editableKeys.map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">
                {formatKeyLabel(key)}
              </Label>
              <Input
                id={key}
                value={editedItem[key] !== undefined ? String(editedItem[key]) : ""}
                onChange={(e) => {
                  const value = e.target.value
                  const parsedValue = !isNaN(Number(value)) && value !== "" ? Number(value) : value
                  handleChange(key, parsedValue)
                }}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Pencil className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
