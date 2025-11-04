"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { ProductBrowser } from "@/components/pos/product-browser"
import { ShoppingCart } from "@/components/pos/shopping-cart"
import { usePosCart } from "@/hooks/use-pos-cart"
import { useSharedInventory } from "@/context/inventory-context"
import type { CartItem } from "@/types/pos.types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PosPage() {
  const { items, updateItem, addOrder } = useSharedInventory()
  const {
    cartItems,
    totalDiscount,
    setTotalDiscount,
    discountType,
    setDiscountType,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemDiscount,
    calculateSubtotal,
    calculateTotal,
    clearCart,
  } = usePosCart()

  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [checkoutData, setCheckoutData] = useState<{
    items: CartItem[]
    total: number
  } | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleCheckout = (items: CartItem[], total: number) => {
    setCheckoutData({ items, total })
    setShowCheckoutDialog(true)
  }

  const confirmCheckout = () => {
    if (!checkoutData) return

    checkoutData.items.forEach((cartItem) => {
      const inventoryItem = items.find((i) => i.id === cartItem.id)
      if (inventoryItem) {
        updateItem({
          ...inventoryItem,
          quantity: inventoryItem.quantity - cartItem.quantity,
          lastUpdated: new Date().toISOString().split("T")[0],
        })
      }
    })

    const today = new Date().toISOString().split("T")[0]
    addOrder({
      items: checkoutData.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        discountType: item.discountType,
      })),
      total: checkoutData.total,
      date: today,
    })

    // Clear cart and show success
    clearCart()
    setShowCheckoutDialog(false)
    setCheckoutData(null)

    // Show success message
    alert(`✓ Compra finalizada exitosamente por $${checkoutData.total.toFixed(2)}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        companyName="Mi Empresa"
        userName="Juan Pérez"
        userEmail="juan.perez@empresa.com"
        onCollapsedChange={setSidebarCollapsed}
        currentPath="/pos"
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Punto de Venta</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-150px)]">
            {/* Product Browser - 2 columns */}
            <div className="lg:col-span-2 overflow-hidden">
              <ProductBrowser items={items} onAddToCart={addToCart} />
            </div>

            {/* Shopping Cart - 1 column */}
            <div className="overflow-hidden">
              <ShoppingCart
                items={cartItems}
                totalDiscount={totalDiscount}
                discountType={discountType}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onUpdateDiscount={updateItemDiscount}
                onSetTotalDiscount={setTotalDiscount}
                onSetDiscountType={setDiscountType}
                onCheckout={handleCheckout}
                calculateSubtotal={calculateSubtotal}
                calculateTotal={calculateTotal}
              />
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirmar Compra</AlertDialogTitle>
          <div className="space-y-4">
            <div>
              <div className="font-semibold mb-2">Resumen de Compra:</div>
              {checkoutData?.items.map((item) => (
                <div key={item.id} className="text-sm flex justify-between mb-1">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t my-2 pt-2 flex justify-between font-bold">
                <span>Total a Pagar:</span>
                <span className="text-primary text-lg">${checkoutData?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <AlertDialogDescription />
          <div className="flex gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCheckout}>Confirmar Pago</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
