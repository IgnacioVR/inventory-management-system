"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { useSharedInventory } from "@/context/inventory-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const { items, orders } = useSharedInventory()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Get today's date
  const today = new Date().toISOString().split("T")[0]

  // Calculate sales for today
  const todaysSales = orders.filter((order) => order.date === today)
  const totalSalesAmount = todaysSales.reduce((sum, order) => sum + order.total, 0)
  const numberOfSales = todaysSales.length

  // Get most sold product today
  const productSalesMap = new Map<string, { name: string; quantity: number; sales: number }>()
  todaysSales.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productSalesMap.get(item.id) || { name: item.name, quantity: 0, sales: 0 }
      productSalesMap.set(item.id, {
        name: item.name,
        quantity: existing.quantity + item.quantity,
        sales: existing.sales + 1,
      })
    })
  })

  const mostSoldProduct = Array.from(productSalesMap.values()).sort((a, b) => b.quantity - a.quantity)[0]

  // Get low stock items (quantity < 10 or status = "Bajo Stock")
  const lowStockItems = items.filter((item) => item.quantity < 10)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        companyName="Mi Empresa"
        userName="Juan Pérez"
        userEmail="juan.perez@empresa.com"
        onCollapsedChange={setSidebarCollapsed}
        currentPath="/dashboard"
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          {/* Sales Today Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Ventas del Día</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Sold */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Vendido Hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">${totalSalesAmount.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {todaysSales.length === 0 ? "Sin ventas aún" : "Actualizado hoy"}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              {/* Number of Sales */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Número de Ventas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{numberOfSales}</div>
                      <p className="text-xs text-muted-foreground mt-1">transacciones hoy</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              {/* Most Sold Product */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Producto Más Vendido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="text-2xl font-bold">{mostSoldProduct?.quantity || 0} unidades</div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{mostSoldProduct?.name || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Low Stock Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Inventario Bajo</h2>
            {lowStockItems.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Todos los productos tienen stock suficiente</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            <h3 className="font-semibold">{item.name}</h3>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="text-foreground font-semibold">{item.quantity}</span> unidades
                              disponibles
                            </div>
                            <div>
                              Categoría: <span className="text-foreground">{item.category}</span>
                            </div>
                            <div>
                              Proveedor: <span className="text-foreground">{item.supplier}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${item.price.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">precio unitario</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
