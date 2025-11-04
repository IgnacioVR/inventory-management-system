"use client"

import { useState } from "react"
import type { CartItem } from "@/types/pos.types"

export function usePosCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("fixed")

  const addToCart = (item: {
    id: string
    name: string
    price: number
    quantity: number
  }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
      }
      return [
        ...prev,
        {
          ...item,
          discount: 0,
          discountType: "percentage",
        },
      ]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  const updateItemDiscount = (id: string, discount: number, type: "percentage" | "fixed") => {
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, discount, discountType: type } : i)))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      let itemTotal = item.price * item.quantity
      if (item.discountType === "percentage") {
        itemTotal *= 1 - item.discount / 100
      } else {
        itemTotal -= item.discount * item.quantity
      }
      return sum + itemTotal
    }, 0)
  }

  const calculateTotal = () => {
    let total = calculateSubtotal()

    if (discountType === "percentage") {
      total *= 1 - totalDiscount / 100
    } else {
      total -= totalDiscount
    }

    return Math.max(0, total)
  }

  const clearCart = () => {
    setCartItems([])
    setTotalDiscount(0)
  }

  return {
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
  }
}
