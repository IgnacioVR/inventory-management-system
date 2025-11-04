"use client"

/**
 * Dialog component for editing the inventory schema (adding new fields)
 * @module components/dialogs/schema-editor-dialog
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Settings2 } from "lucide-react"
import { applySchemaChanges, extractItemKeys } from "@/lib/inventory-utils"
import type { InventoryItem } from "@/types/inventory.types"

interface SchemaEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: InventoryItem[]
  onUpdateSchema: (updatedItems: InventoryItem[]) => void
}

interface NewField {
  name: string
  defaultValue: string
}

export function SchemaEditorDialog({ open, onOpenChange, items, onUpdateSchema }: SchemaEditorDialogProps) {
  const [newFields, setNewFields] = useState<NewField[]>([{ name: "", defaultValue: "" }])

  const addFieldRow = () => {
    setNewFields([...newFields, { name: "", defaultValue: "" }])
  }

  const removeFieldRow = (index: number) => {
    setNewFields(newFields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, key: "name" | "defaultValue", value: string) => {
    const updated = [...newFields]
    updated[index][key] = value
    setNewFields(updated)
  }

  const handleSave = () => {
    const validFields = newFields.filter((field) => field.name.trim() !== "")

    if (validFields.length === 0) {
      return
    }

    const updatedItems = applySchemaChanges(items, validFields)
    onUpdateSchema(updatedItems)

    setNewFields([{ name: "", defaultValue: "" }])
  }

  const handleClose = () => {
    setNewFields([{ name: "", defaultValue: "" }])
    onOpenChange(false)
  }

  const currentFields = extractItemKeys(items)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            <DialogTitle>Editar Estructura del JSON</DialogTitle>
          </div>
          <DialogDescription>
            Agrega nuevos campos a todos los elementos del inventario. Los campos se aplicarán a todos los productos
            existentes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* New Fields Input */}
          <div className="space-y-3">
            {newFields.map((field, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`field-name-${index}`}>Nombre del Campo</Label>
                  <Input
                    id={`field-name-${index}`}
                    placeholder="ej: categoria, fechaVencimiento"
                    value={field.name}
                    onChange={(e) => updateField(index, "name", e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`field-value-${index}`}>Valor por Defecto</Label>
                  <Input
                    id={`field-value-${index}`}
                    placeholder="ej: Sin categoría, 2025-12-31"
                    value={field.defaultValue}
                    onChange={(e) => updateField(index, "defaultValue", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeFieldRow(index)}
                  disabled={newFields.length === 1}
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addFieldRow} className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Otro Campo
          </Button>

          {/* Current Fields Display */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Campos Actuales en el Inventario:</h4>
            <div className="flex flex-wrap gap-2">
              {currentFields.length > 0 ? (
                currentFields.map((key) => (
                  <span key={key} className="px-2 py-1 bg-background rounded text-xs font-mono border">
                    {key}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No hay campos disponibles</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Aplicar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
