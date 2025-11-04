/**
 * Application-wide constants for inventory management
 */

import type { InventoryItem } from "@/types/inventory.types"

export const DEFAULT_INVENTORY_ITEMS: InventoryItem[] = [
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
]

export const EXAMPLE_JSON_FORMAT = `[
  {
    "name": "Producto Ejemplo",
    "category": "Categoría",
    "quantity": 10,
    "price": 99.99,
    "status": "En Stock"
  }
]`

export const NUMERIC_FIELDS = ["quantity", "price", "stock", "amount", "total"]

export const DATE_FIELDS = ["lastUpdated", "createdAt", "updatedAt", "date", "fechaVencimiento"]
