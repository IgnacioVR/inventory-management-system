"use client"

/**
 * Sidebar component with navigation, logo, and user info
 * @module components/layout/sidebar
 */

import { Package, LayoutGrid, ChevronLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"

interface SidebarProps {
  companyName?: string
  companyLogo?: string
  userName?: string
  userEmail?: string
  userAvatar?: string
  onCollapsedChange?: (collapsed: boolean) => void
  currentPath?: string
}

export function Sidebar({
  companyName = "Mi Empresa",
  companyLogo,
  userName = "Usuario Admin",
  userEmail = "admin@empresa.com",
  userAvatar,
  onCollapsedChange,
  currentPath = "/",
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)
  }

  const navigationItems = [
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard", active: currentPath === "/dashboard" },
    { icon: Package, label: "Inventario", href: "/", active: currentPath === "/" },
    { icon: ShoppingCart, label: "Punto de Venta", href: "/pos", active: currentPath === "/pos" },
  ]

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 flex flex-col z-50",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header with Logo/Company Name */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            {companyLogo ? (
              <img src={companyLogo || "/placeholder.svg"} alt={companyName} className="w-8 h-8 rounded-lg" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight">{companyName}</span>
              <span className="text-xs text-muted-foreground">Sistema de Gestión</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleCollapse}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              collapsed && "justify-center px-2",
              !item.active && "hover:bg-accent",
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </Button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors",
            collapsed && "justify-center",
          )}
        >
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium text-sm truncate">{userName}</span>
              <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
