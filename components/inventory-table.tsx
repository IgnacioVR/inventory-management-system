/**
 * Table view component for displaying inventory items
 * @module components/inventory-table
 */

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InventoryTableRow } from "@/components/inventory/inventory-table-row"
import { extractItemKeys, formatKeyLabel } from "@/lib/inventory-utils"
import type { InventoryItem } from "@/types/inventory.types"

interface InventoryTableProps {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDetail: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
}

export function InventoryTable({ items, onEdit, onDetail, onDelete }: InventoryTableProps) {
  const columns = extractItemKeys(items)

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl">
        <p className="text-muted-foreground">No hay productos en el inventario</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((key) => (
                <TableHead key={key} className="font-semibold">
                  {formatKeyLabel(key)}
                </TableHead>
              ))}
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <InventoryTableRow
                key={item.id}
                item={item}
                columns={columns}
                onEdit={onEdit}
                onDetail={onDetail}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
