"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertCircle, FileJson } from "lucide-react"
import { normalizeImportedData } from "@/lib/inventory-utils"
import type { InventoryItem } from "@/types/inventory.types"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (items: InventoryItem[]) => void
  currentItems: InventoryItem[]
}

export function ImportDialog({ open, onOpenChange, onImport, currentItems }: ImportDialogProps) {
  const [jsonText, setJsonText] = useState("")
  const [error, setError] = useState("")

  const generateExample = () => {
    if (currentItems.length === 0) {
      return `[
  {
    "name": "Producto Ejemplo",
    "category": "Categoría",
    "quantity": 10,
    "price": 99.99,
    "status": "En Stock"
  }
]`
    }

    // Get first item and create example with same structure
    const firstItem = currentItems[0]
    const exampleItem: Record<string, any> = {}

    Object.keys(firstItem).forEach((key) => {
      if (key === "id") return // Skip id field
      exampleItem[key] = firstItem[key]
    })

    return JSON.stringify([exampleItem], null, 2)
  }

  const handleLoadCurrentData = () => {
    const dataToExport = currentItems.map((item) => {
      const { id, ...rest } = item
      return rest
    })
    setJsonText(JSON.stringify(dataToExport, null, 2))
    setError("")
  }

  const handleImport = () => {
    try {
      setError("")
      const parsed = JSON.parse(jsonText)
      const normalizedItems = normalizeImportedData(parsed)

      onImport(normalizedItems)
      setJsonText("")
    } catch (err) {
      setError("JSON inválido. Por favor verifica el formato.")
    }
  }

  const handleClose = () => {
    setJsonText("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Inventario desde JSON
          </DialogTitle>
          <DialogDescription>
            Pega tu JSON personalizado aquí o carga los datos actuales para editarlos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadCurrentData}
              className="flex-1 bg-transparent"
            >
              <FileJson className="w-4 h-4 mr-2" />
              Cargar Datos Actuales
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">JSON de Inventario</label>
            <Textarea
              placeholder={generateExample()}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="font-mono text-sm min-h-[350px]"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription className="text-sm">
              <strong>Estructura actual de tus datos:</strong>
              <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-x-auto max-h-[200px]">{generateExample()}</pre>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!jsonText.trim()}>
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
