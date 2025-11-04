"use client"

import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"
import type { CartItem } from "@/types/pos.types"

interface ShoppingCartProps {
  items: CartItem[]
  totalDiscount: number
  discountType: "percentage" | "fixed"
  onRemoveItem: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onUpdateDiscount: (id: string, discount: number, type: "percentage" | "fixed") => void
  onSetTotalDiscount: (discount: number) => void
  onSetDiscountType: (type: "percentage" | "fixed") => void
  onCheckout: (items: CartItem[], total: number) => void
  calculateSubtotal: () => number
  calculateTotal: () => number
}

export function ShoppingCart({
  items,
  totalDiscount,
  discountType,
  onRemoveItem,
  onUpdateQuantity,
  onUpdateDiscount,
  onSetTotalDiscount,
  onSetDiscountType,
  onCheckout,
  calculateSubtotal,
  calculateTotal,
}: ShoppingCartProps) {
  const subtotal = useMemo(() => calculateSubtotal(), [items, calculateSubtotal])
  const total = useMemo(() => calculateTotal(), [items, totalDiscount, discountType, calculateTotal])

  return (
    <div className="flex flex-col gap-4 h-full bg-card rounded-lg border p-4">
      <h2 className="text-2xl font-bold">Carrito de Compras</h2>

      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">El carrito está vacío</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-3 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onRemoveItem(item.id)} className="h-6 w-6 p-0">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 bg-transparent"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                  className="h-7 w-16 text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 bg-transparent"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <p className="text-sm font-semibold ml-auto">${(item.price * item.quantity).toFixed(2)}</p>
              </div>

              {/* Item Discount */}
              <div className="bg-secondary/50 rounded p-2 space-y-1">
                <p className="text-xs font-medium">Descuento en item:</p>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="0"
                    value={item.discount}
                    onChange={(e) =>
                      onUpdateDiscount(item.id, Number.parseFloat(e.target.value) || 0, item.discountType)
                    }
                    className="h-7 flex-1 text-sm"
                  />
                  <select
                    value={item.discountType}
                    onChange={(e) => onUpdateDiscount(item.id, item.discount, e.target.value as "percentage" | "fixed")}
                    className="h-7 px-2 text-xs border rounded bg-background"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Totals Section */}
      {items.length > 0 && (
        <div className="space-y-3 border-t pt-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          {/* Total Discount */}
          <div className="bg-secondary/50 rounded p-3 space-y-2">
            <p className="text-sm font-medium">Descuento Total:</p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0"
                value={totalDiscount}
                onChange={(e) => onSetTotalDiscount(Number.parseFloat(e.target.value) || 0)}
                className="h-8 flex-1 text-sm"
              />
              <select
                value={discountType}
                onChange={(e) => onSetDiscountType(e.target.value as "percentage" | "fixed")}
                className="h-8 px-2 text-xs border rounded bg-background"
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-3">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <Button onClick={() => onCheckout(items, total)} className="w-full h-10 text-base font-semibold">
            Finalizar Compra
          </Button>
        </div>
      )}
    </div>
  )
}
