"use client"

/**
 * Header component with view controls and action buttons
 * @module components/inventory-header
 */

import { Button } from "@/components/ui/button"
import { LayoutGrid, Table, Upload, Settings2, Download } from "lucide-react"
import type { ViewMode } from "@/types/inventory.types"

interface InventoryHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onImport: () => void
  onEditSchema: () => void
  onExport: () => void
  itemCount: number
}

export function InventoryHeader({
  viewMode,
  onViewModeChange,
  onImport,
  onEditSchema,
  onExport,
  itemCount,
}: InventoryHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Inventario</h1>
        <p className="text-muted-foreground mt-1">Administra y visualiza tu inventario de manera eficiente</p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Total de productos:</span>
          <span className="text-2xl font-bold text-primary">{itemCount}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange("cards")}
            className={viewMode === "cards" ? "bg-primary text-primary-foreground" : ""}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Cards
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange("table")}
            className={viewMode === "table" ? "bg-primary text-primary-foreground" : ""}
          >
            <Table className="w-4 h-4 mr-2" />
            Tabla
          </Button>

          {/* Action Buttons */}
          <Button onClick={onEditSchema} size="sm" variant="outline" className="ml-2 bg-transparent">
            <Settings2 className="w-4 h-4 mr-2" />
            Editar Estructura
          </Button>
          <Button onClick={onExport} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={onImport} size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>
    </div>
  )
}
