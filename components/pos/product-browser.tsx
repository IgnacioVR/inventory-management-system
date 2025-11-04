"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import type { InventoryItem } from "@/types/inventory.types"

interface ProductBrowserProps {
  items: InventoryItem[]
  onAddToCart: (item: {
    id: string
    name: string
    price: number
    quantity: number
  }) => void
}

export function ProductBrowser({ items, onAddToCart }: ProductBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => [...new Set(items.map((item) => item.category))], [items])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === null || item.category === selectedCategory

      return matchesSearch && matchesCategory && item.quantity > 0
    })
  }, [items, searchTerm, selectedCategory])

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Productos Disponibles</h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-3 flex flex-col gap-2">
              <div>
                <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{item.quantity} en stock</p>
                </div>

                <Button
                  size="sm"
                  onClick={() =>
                    onAddToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                    })
                  }
                  className="h-8 px-2 text-xs"
                >
                  Agregar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}
