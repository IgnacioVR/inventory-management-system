"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { InventoryItem } from "@/types/inventory.types"

export interface Order {
  id: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    discount: number
    discountType: "percentage" | "fixed"
  }>
  total: number
  date: string // YYYY-MM-DD
  timestamp: number
}

interface InventoryContextType {
  items: InventoryItem[]
  setItems: (items: InventoryItem[]) => void
  updateItem: (item: InventoryItem) => void
  addItem: (item: InventoryItem) => void
  deleteItem: (id: string) => void
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "timestamp">) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

const DEFAULT_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "1",
    name: "Laptop Dell XPS 15",
    category: "Electrónica",
    quantity: 15,
    price: 1299.99,
    status: "En Stock",
    supplier: "Dell Inc.",
    lastUpdated: "2025-01-15",
  },
  {
    id: "2",
    name: "Silla Ergonómica",
    category: "Muebles",
    quantity: 8,
    price: 349.99,
    status: "Bajo Stock",
    supplier: "Herman Miller",
    lastUpdated: "2025-01-10",
  },
  {
    id: "3",
    name: 'Monitor 4K 27"',
    category: "Electrónica",
    quantity: 23,
    price: 599.99,
    status: "En Stock",
    supplier: "LG Electronics",
    lastUpdated: "2025-01-18",
  },
  {
    id: "4",
    name: "Teclado Mecánico RGB",
    category: "Accesorios",
    quantity: 45,
    price: 129.99,
    status: "En Stock",
    supplier: "Corsair",
    lastUpdated: "2025-01-20",
  },
  {
    id: "5",
    name: "Mouse Inalámbrico",
    category: "Accesorios",
    quantity: 32,
    price: 45.99,
    status: "En Stock",
    supplier: "Logitech",
    lastUpdated: "2025-01-19",
  },
  {
    id: "6",
    name: "Escritorio de Madera",
    category: "Muebles",
    quantity: 5,
    price: 599.99,
    status: "Bajo Stock",
    supplier: "IKEA",
    lastUpdated: "2025-01-18",
  },
]

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<InventoryItem[]>(DEFAULT_INVENTORY_ITEMS)
  const [orders, setOrdersState] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("inventory-items")
    const storedOrders = localStorage.getItem("orders")
    if (stored) {
      try {
        setItemsState(JSON.parse(stored))
      } catch (e) {
        console.error("Error loading inventory from localStorage:", e)
      }
    }
    if (storedOrders) {
      try {
        setOrdersState(JSON.parse(storedOrders))
      } catch (e) {
        console.error("Error loading orders from localStorage:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("inventory-items", JSON.stringify(items))
    }
  }, [items, isLoaded])

  // Save orders to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders, isLoaded])

  const setItems = (newItems: InventoryItem[]) => {
    setItemsState(newItems)
  }

  const updateItem = (updatedItem: InventoryItem) => {
    setItemsState((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  const addItem = (newItem: InventoryItem) => {
    setItemsState((prev) => [...prev, newItem])
  }

  const deleteItem = (id: string) => {
    setItemsState((prev) => prev.filter((item) => item.id !== id))
  }

  const addOrder = (order: Omit<Order, "id" | "timestamp">) => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      timestamp: Date.now(),
    }
    setOrdersState((prev) => [...prev, newOrder])
  }

  return (
    <InventoryContext.Provider value={{ items, setItems, updateItem, addItem, deleteItem, orders, addOrder }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useSharedInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error("useSharedInventory must be used within InventoryProvider")
  }
  return context
}
