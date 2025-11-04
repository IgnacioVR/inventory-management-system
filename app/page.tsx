"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { InventoryHeader } from "@/components/inventory-header"
import { InventoryCards } from "@/components/inventory-cards"
import { InventoryTable } from "@/components/inventory-table"
import { ImportDialog } from "@/components/dialogs/import-dialog"
import { EditDialog } from "@/components/dialogs/edit-dialog"
import { DetailDialog } from "@/components/dialogs/detail-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import { SchemaEditorDialog } from "@/components/dialogs/schema-editor-dialog"
import { useViewMode } from "@/hooks/use-view-mode"
import { useSharedInventory } from "@/context/inventory-context"
import { useState } from "react"

export default function InventoryPage() {
  const { viewMode, setViewMode } = useViewMode("cards")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const { items, setItems, updateItem, deleteItem } = useSharedInventory()
  const [selectedItem, setSelectedItem] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(null)

  const handleImport = (newItems) => {
    setItems(newItems)
    setDialogOpen(null)
  }

  const handleEdit = (updatedItem) => {
    updateItem(updatedItem)
    setDialogOpen(null)
    setSelectedItem(null)
  }

  const handleDelete = () => {
    if (selectedItem?.id) {
      deleteItem(selectedItem.id)
      setDialogOpen(null)
      setSelectedItem(null)
    }
  }

  const handleUpdateSchema = (updatedItems) => {
    setItems(updatedItems)
    setDialogOpen(null)
  }

  const openDialog = (type, item) => {
    setSelectedItem(item)
    setDialogOpen(type)
  }

  const handleExport = () => {
    const dataToExport = items.map((item) => {
      const { id, ...rest } = item
      return rest
    })

    const jsonString = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `inventario-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        companyName="Mi Empresa"
        userName="Juan Pérez"
        userEmail="juan.perez@empresa.com"
        onCollapsedChange={setSidebarCollapsed}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <InventoryHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onImport={() => setDialogOpen("import")}
            onEditSchema={() => setDialogOpen("schema")}
            onExport={handleExport}
            itemCount={items.length}
          />

          <div className="mt-8">
            {viewMode === "cards" ? (
              <InventoryCards
                items={items}
                onEdit={(item) => openDialog("edit", item)}
                onDetail={(item) => openDialog("detail", item)}
                onDelete={(item) => openDialog("delete", item)}
              />
            ) : (
              <InventoryTable
                items={items}
                onEdit={(item) => openDialog("edit", item)}
                onDetail={(item) => openDialog("detail", item)}
                onDelete={(item) => openDialog("delete", item)}
              />
            )}
          </div>

          <ImportDialog
            open={dialogOpen === "import"}
            onOpenChange={(open) => !open && setDialogOpen(null)}
            onImport={handleImport}
            currentItems={items}
          />

          <SchemaEditorDialog
            open={dialogOpen === "schema"}
            onOpenChange={(open) => !open && setDialogOpen(null)}
            items={items}
            onUpdateSchema={handleUpdateSchema}
          />

          {selectedItem && (
            <>
              <EditDialog
                open={dialogOpen === "edit"}
                onOpenChange={(open) => !open && setDialogOpen(null)}
                item={selectedItem}
                onSave={handleEdit}
              />

              <DetailDialog
                open={dialogOpen === "detail"}
                onOpenChange={(open) => !open && setDialogOpen(null)}
                item={selectedItem}
              />

              <DeleteDialog
                open={dialogOpen === "delete"}
                onOpenChange={(open) => !open && setDialogOpen(null)}
                item={selectedItem}
                onConfirm={handleDelete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
