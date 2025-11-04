"use client"

/**
 * Individual card component for displaying a single inventory item
 * @module components/inventory/inventory-card-item
 */

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { getStatusColor, formatPrice } from "@/lib/inventory-utils"
import type { InventoryItem } from "@/types/inventory.types"

interface InventoryCardItemProps {
  item: InventoryItem
  onEdit: (item: InventoryItem) => void
  onDetail: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
}

export function InventoryCardItem({ item, onEdit, onDetail, onDelete }: InventoryCardItemProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight text-balance">{item.name || "Sin nombre"}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.category || "Sin categoría"}</p>
          </div>
          {item.status && (
            <Badge className={getStatusColor(item.status)} variant="secondary">
              {item.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2">
          {item.quantity !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cantidad:</span>
              <span className="font-medium">{item.quantity}</span>
            </div>
          )}
          {item.price !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precio:</span>
              <span className="font-medium text-primary">{formatPrice(item.price)}</span>
            </div>
          )}
          {item.supplier && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Proveedor:</span>
              <span className="font-medium truncate ml-2">{item.supplier}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3 border-t">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onDetail(item)}>
          <Eye className="w-4 h-4 mr-1" />
          Ver
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit(item)}>
          <Pencil className="w-4 h-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(item)}
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
